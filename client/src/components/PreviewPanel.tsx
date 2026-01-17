import type { AspectRatio, IThumbnail } from "../assets/assets";
import { DownloadIcon, ImageIcon, Loader2Icon } from "lucide-react";

const PreviewPanel = ({
  thumbnail,
  isLoading,
  aspectRatio,
}: {
  thumbnail: IThumbnail | null;
  isLoading: boolean;
  aspectRatio: AspectRatio;
}) => {
  const aspectClasses: Record<AspectRatio, string> = {
    "16:9": "aspect-video",
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
  };

  const onDownload = () => {
    if (!thumbnail?.image_url) return;
    const link = document.createElement("a");
    link.href = thumbnail.image_url.replace(
      "/upload",
      "/upload/fl_attachment"
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const overlayText =
    thumbnail?.text_overlay || thumbnail?.title || "";

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div
        className={`relative overflow-hidden rounded-xl ${aspectClasses[aspectRatio]}`}
      >
        {/* ---------------- LOADING ---------------- */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40">
            <Loader2Icon className="size-8 animate-spin text-zinc-300" />
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-200">
                AI is generating your thumbnail...
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                This may take 10–20 seconds
              </p>
            </div>
          </div>
        )}

        {/* ---------------- IMAGE ---------------- */}
        {!isLoading && thumbnail?.image_url && (
          <div className="group relative h-full w-full">
            <img
              src={thumbnail.image_url}
              alt={thumbnail.title}
              className="h-full w-full object-cover"
            />

            {/* gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

            {/* ---------------- TEXT OVERLAY ---------------- */}
            {overlayText && (
              <div className="absolute bottom-6 left-6 right-6">
                <h1
                  className="
                    text-yellow-400
                    text-4xl
                    sm:text-5xl
                    font-extrabold
                    leading-tight
                    uppercase
                    tracking-wide
                    drop-shadow-[0_6px_8px_rgba(0,0,0,0.9)]
                  "
                  style={{
                    textShadow:
                      "3px 3px 0 #000, -3px 3px 0 #000, 3px -3px 0 #000, -3px -3px 0 #000",
                  }}
                >
                  {overlayText}
                </h1>
              </div>
            )}

            {/* ---------------- DOWNLOAD ---------------- */}
            <div className="absolute inset-0 flex items-end justify-center bg-black/10 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                className="mb-6 flex items-center gap-2 rounded-md px-5 py-2.5 text-xs font-medium transition bg-white/30 ring-2 ring-white/40 backdrop-blur hover:scale-105 active:scale-95"
                onClick={onDownload}
              >
                <DownloadIcon className="size-4" />
                Download Thumbnail
              </button>
            </div>
          </div>
        )}

        {/* ---------------- EMPTY STATE ---------------- */}
        {!isLoading && !thumbnail?.image_url && (
          <div className="absolute inset-0 m-2 flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-white/20 bg-black/25">
            <div className="max-sm:hidden flex size-20 items-center justify-center rounded-full bg-white/10">
              <ImageIcon className="size-10 text-white opacity-50" />
            </div>
            <div className="px-4 text-center">
              <p className="text-zinc-200 font-medium">
                Generate your first thumbnail
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                Fill out the form and click Generate
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;
