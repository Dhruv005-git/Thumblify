import React, { useEffect, useRef, useState } from "react";
import type { AspectRatio, IThumbnail } from "../assets/assets";
import { DownloadIcon, ImageIcon, Loader2Icon } from "lucide-react";
import api from "../configs/api"; // optional: used for saving position to your backend
import toast from "react-hot-toast";

/*
  Important: add Google Fonts in your index.html for the fonts you want to use:
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Montserrat:wght@700;900&display=swap" rel="stylesheet">

  This component provides:
   - draggable text (with pointer events, works on touch & mouse)
   - font-family selector
   - font-size slider
   - color picker for text
   - save-position (calls backend if thumbnail._id exists)
   - download/export which rasterizes image + text to canvas

  Note: backend endpoint used to save position is PATCH /api/thumbnail/:id (you can change URL in savePosition())
*/

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      ctx.strokeText(line.trim(), x, y);
      ctx.fillText(line.trim(), x, y);
      line = words[i] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  // last line
  ctx.strokeText(line.trim(), x, y);
  ctx.fillText(line.trim(), x, y);
}

const FONT_OPTIONS = [
  { label: "Anton", value: "Anton, Impact, Arial" },
  { label: "Bebas Neue", value: "'Bebas Neue', Impact, Arial" },
  { label: "Montserrat", value: "'Montserrat', Arial" },
  { label: "Impact", value: "Impact, Arial Black, sans-serif" },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
];

const PreviewPanel: React.FC<{
  thumbnail: IThumbnail | null;
  isLoading: boolean;
  aspectRatio: AspectRatio;
}> = ({ thumbnail, isLoading, aspectRatio }) => {
  const aspectClasses: Record<AspectRatio, string> = {
    "16:9": "aspect-video",
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
  };

  const textDefault =
    (thumbnail?.text_overlay && String(thumbnail.text_overlay).trim()) ||
    (thumbnail?.title && String(thumbnail.title).trim()) ||
    "";

  // refs
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  // position stored as percent so it is stable across resolutions
  const [positionPct, setPositionPct] = useState({ x: 0.06, y: 0.78 }); // default bottom-left
  const [fontFamily, setFontFamily] = useState(FONT_OPTIONS[0].value);
  const [fontSizePct, setFontSizePct] = useState(0.075); // proportion of width
  const [color, setColor] = useState("#FFD400");
  const [isEditing, setIsEditing] = useState(true);
  const [text, setText] = useState(textDefault);
  const [saving, setSaving] = useState(false);

  // initialize position from thumbnail if available (expects thumbnail.posX,posY as percentages 0..1)
  useEffect(() => {
    if (!thumbnail) return;
    // try to read saved fields (use names you stored in backend). Fallback to defaults.
    const maybeX = (thumbnail as any).text_pos_x;
    const maybeY = (thumbnail as any).text_pos_y;
    const maybeFont = (thumbnail as any).text_font;
    const maybeSize = (thumbnail as any).text_size_pct;
    const maybeColor = (thumbnail as any).text_color;

    if (typeof maybeX === "number" && typeof maybeY === "number") {
      setPositionPct({ x: maybeX, y: maybeY });
    }
    if (typeof maybeFont === "string") setFontFamily(maybeFont);
    if (typeof maybeSize === "number") setFontSizePct(maybeSize);
    if (typeof maybeColor === "string") setColor(maybeColor);

    // update text if thumbnail has text_overlay
    if (thumbnail.text_overlay) setText(String(thumbnail.text_overlay));
  }, [thumbnail]);

  // pointer handlers (pointer API covers touch & mouse)
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isEditing) return;
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    pointerIdRef.current = e.pointerId;
    draggingRef.current = true;

    const rect = el.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    // compute new top-left position in px for the element being dragged (we used the element's own rect offset)
    const pxX = e.clientX - containerRect.left - offsetRef.current.x;
    const pxY = e.clientY - containerRect.top - offsetRef.current.y;

    // clamp inside container
    const clampedX = Math.max(0, Math.min(pxX, containerRect.width));
    const clampedY = Math.max(0, Math.min(pxY, containerRect.height));

    setPositionPct({ x: clampedX / containerRect.width, y: clampedY / containerRect.height });
  };

  const onPointerUp = (e?: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== null && e && e.pointerId !== pointerIdRef.current) return;
    draggingRef.current = false;
    pointerIdRef.current = null;
  };

  // save position to backend (optional) — PATCH /api/thumbnail/:id
  const savePosition = async () => {
    if (!thumbnail?._id) return;
    setSaving(true);
    try {
      // adapt to your backend payload
      await api.patch(`/api/thumbnail/${thumbnail._id}`, {
        text_pos_x: positionPct.x,
        text_pos_y: positionPct.y,
        text_font: fontFamily,
        text_size_pct: fontSizePct,
        text_color: color,
        text_overlay: text,
      });
      toast?.success?.("Saved position");
    } catch (err: any) {
      console.error(err);
      toast?.error?.("Failed to save position");
    } finally {
      setSaving(false);
    }
  };

  // download/export: draw image + gradient + text using normalized position + wrap
  const onDownload = () => {
    if (!thumbnail?.image_url) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = thumbnail.image_url;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;

      // draw bg
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // gradient
      const grad = ctx.createLinearGradient(
        0,
        canvas.height * 0.55,
        0,
        canvas.height
      );
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(0,0,0,0.8)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // compute font size from width
      const fontSizePx = Math.max(18, Math.round(canvas.width * fontSizePct));
      ctx.font = `900 ${fontSizePx}px ${fontFamily}`;
      ctx.textBaseline = "bottom";
      ctx.fillStyle = color;
      ctx.strokeStyle = "#000";
      ctx.lineWidth = Math.max(2, Math.round(fontSizePx * 0.12));

      // compute position in px
      const pxX = canvas.width * positionPct.x + canvas.width * 0.01; // small left padding
      const pxY = canvas.height * positionPct.y + fontSizePx; // baseline position

      // wrap and draw
      const maxTextWidth = canvas.width * 0.88;
      const lineHeight = Math.round(fontSizePx * 1.12);
      wrapText(ctx, text.toUpperCase(), pxX, pxY, maxTextWidth, lineHeight);

      // trigger download
      const link = document.createElement("a");
      link.download = "thumbnail.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.onerror = (e) => {
      console.error("Image load failed", e);
      alert("Failed to load image for export. Try again or use a CORS-enabled image.");
    };
  };

  // small helpers for UI
  const pxLeft = containerRef.current ? `${Math.round(positionPct.x * (containerRef.current.clientWidth || 1))}px` : undefined;
  const pxTop = containerRef.current ? `${Math.round(positionPct.y * (containerRef.current.clientHeight || 1))}px` : undefined;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="bg-black/60 text-sm px-3 py-2 rounded"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <label className="text-xs text-zinc-300 mr-1">Size</label>
            <input
              type="range"
              min={0.03}
              max={0.2}
              step={0.005}
              value={fontSizePct}
              onChange={(e) => setFontSizePct(Number(e.target.value))}
              className="w-40"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-zinc-300">Color</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </div>

          <button
            onClick={() => setIsEditing((s) => !s)}
            className="px-3 py-2 bg-zinc-800 text-sm rounded"
          >
            {isEditing ? "Lock" : "Edit"}
          </button>

          <button
            onClick={savePosition}
            disabled={!thumbnail?._id || saving}
            className={`px-3 py-2 text-sm rounded ${thumbnail?._id ? "bg-pink-600" : "bg-zinc-600/40"}`}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onDownload} className="px-3 py-2 bg-green-600 rounded text-white flex items-center gap-2">
            <DownloadIcon className="size-4" /> Download
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`relative overflow-hidden rounded-2xl shadow-2xl ${aspectClasses[aspectRatio]}`}
        style={{ minHeight: 240 }}
      >
        {/* loading */}
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60">
            <Loader2Icon className="size-10 animate-spin text-zinc-200" />
          </div>
        )}

        {/* image */}
        {!isLoading && thumbnail?.image_url && (
          <div className="relative h-full w-full">
            <img src={thumbnail.image_url} alt={thumbnail.title || "thumb"} className="h-full w-full object-cover" />

            {/* overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />

            {/* draggable preview text */}
            {text && (
              <div
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                style={{
                  position: "absolute",
                  left: pxLeft,
                  top: pxTop,
                  transform: "translate(0, 0)",
                  color,
                  fontFamily,
                  fontWeight: 900,
                  fontSize: `${Math.round((containerRef.current?.clientWidth || 600) * fontSizePct)}px`,
                  textTransform: "uppercase",
                  textShadow: "3px 3px 0 #000, -3px 3px 0 #000, 3px -3px 0 #000, -3px -3px 0 #000, 0 8px 20px rgba(0,0,0,0.9)",
                  cursor: isEditing ? "move" : "default",
                  userSelect: "none",
                  whiteSpace: "pre-wrap",
                  maxWidth: "75%",
                }}
                className={`z-40 ${isEditing ? "ring-2 ring-pink-500/30 p-1 rounded" : ""}`}
              >
                {text}
              </div>
            )}

            {/* empty state overlay when no image */}
          </div>
        )}

        {!isLoading && !thumbnail?.image_url && (
          <div className="absolute inset-0 m-4 flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-white/20 bg-black/30">
            <div className="flex size-20 items-center justify-center rounded-full bg-white/10">
              <ImageIcon className="size-10 text-white/60" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-zinc-200">Your thumbnail will appear here</p>
              <p className="mt-1 text-xs text-zinc-400">Enter title and click Generate</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;