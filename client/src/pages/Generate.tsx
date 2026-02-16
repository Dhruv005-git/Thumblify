import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  type IThumbnail,
  type AspectRatio,
  colorSchemes,
  type ThumbnailStyle,
} from "../assets/assets";

import SoftBackDrop from "../components/SoftBackDrop";
import AspectRatioSelector from "../components/AspectRatioSelector";
import StyleSelector from "../components/StyleSelector";
import ColorSchemeSelector from "../components/ColorSchemeSelector";
import PreviewPanel from "../components/PreviewPanel";

import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../configs/api";

const Generate = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [title, setTitle] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");

  const [thumbnail, setThumbnail] = useState<IThumbnail | null>(null);
  const [loading, setLoading] = useState(false);

  // Options state
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [colorSchemeId, setColorSchemeId] = useState<string>(
    colorSchemes[0].id
  );
  const [style, setStyle] = useState<ThumbnailStyle>("Bold & Graphic");

  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);

  /* ---------------- GENERATE OPTIONS ---------------- */

  const handleGenerate = async () => {
  if (!isLoggedIn)
    return toast.error("Please login to generate thumbnails");

  if (!title.trim()) return toast.error("Title is required");

  setLoading(true);
  setOptions([]);

  try {
    const api_payload = {
      title,
      prompt: additionalDetails,
      style,
      aspect_ratio: aspectRatio,
      color_scheme: colorSchemeId,
    };

    const { data } = await api.post(
      "/api/thumbnail/generate-options",
      api_payload
    );

    if (data.options) {
      toast.success("Choose one thumbnail option!");
      setOptions(data.options);
    }
  } catch (error: any) {
    console.log("GENERATION ERROR:", error);

    // ✅ QUOTA LIMIT ERROR (429)
    if (error.response?.status === 429) {
      return toast.error(
        "AI limit reached😅! Please try again later"
      );
    }

    // ✅ Normal Errors
    toast.error(error?.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  /* ---------------- FINALIZE SAVE ---------------- */

  const handleSaveThumbnail = async () => {
    if (!selectedOption) return toast.error("Please select an option first!");

    try {
      setLoading(true);

      const { data } = await api.post("/api/thumbnail/finalize", {
        selectedImageUrl: selectedOption,
        title,
        prompt: additionalDetails,
        style,
        aspect_ratio: aspectRatio,
        color_scheme: colorSchemeId,
        text_overlay: title.toUpperCase(),
      });

      if (data.thumbnail) {
        toast.success("Thumbnail saved successfully!");

        // Clear options after saving
        setOptions([]);
        setSelectedOption(null);

        navigate("/generate/" + data.thumbnail._id);
      }
    } catch (error: any) {
  console.log("FINALIZE ERROR:", error);

  if (error.response?.status === 429) {
    return toast.error(
      "⚠️ Upload limit reached. Please try again later."
    );
  }

  toast.error(error?.response?.data?.message || "Finalization failed");
} finally {
  setLoading(false);
}
  };

  /* ---------------- FETCH THUMBNAIL ---------------- */

  const fetchThumbnail = async () => {
    try {
      const { data } = await api.get(`/api/user/thumbnail/${id}`);

      setThumbnail(data?.thumbnail as IThumbnail);
      setLoading(!data?.thumbnail?.image_url);

      setAdditionalDetails(data?.thumbnail?.user_prompt);
      setTitle(data?.thumbnail?.title);
      setColorSchemeId(data?.thumbnail?.color_scheme);
      setAspectRatio(data?.thumbnail?.aspect_ratio);
      setStyle(data.thumbnail.style);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn && id) {
      fetchThumbnail();
    }

    if (id && loading && isLoggedIn) {
      const interval = setInterval(() => {
        fetchThumbnail();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [id, loading, isLoggedIn]);

  useEffect(() => {
    if (!id && thumbnail) {
      setThumbnail(null);
    }
  }, [pathname]);

  return (
    <>
      <SoftBackDrop />

      <div className="pt-24 min-h-screen">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8">
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            {/* LEFT PANEL */}
            <div className={`space-y-6 ${id && `pointer-events-none`}`}>
              <div className="p-6 rounded-2xl bg-white/8 border border-white/12 shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-zinc-100 mb-1">
                    Create Your Thumbnail
                  </h2>
                  <p className="text-sm text-zinc-400">
                    Describe your vision and let AI bring it to life
                  </p>
                </div>

                {/* Inputs */}
                <div className="space-y-5">
                  {/* Title */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Title or Topic
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={100}
                      placeholder="e.g., 10 Tips for Better Sleep"
                      className="w-full px-4 py-3 rounded-lg border border-white/12 bg-black/20 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <div className="text-xs text-zinc-400">
                      {title.length}/100
                    </div>
                  </div>

                  {/* Aspect Ratio */}
                  <AspectRatioSelector
                    value={aspectRatio}
                    onChange={setAspectRatio}
                  />

                  {/* Style */}
                  <StyleSelector
                    value={style}
                    onChange={setStyle}
                    isOpen={styleDropdownOpen}
                    setIsOpen={setStyleDropdownOpen}
                  />

                  {/* Color Scheme */}
                  <ColorSchemeSelector
                    value={colorSchemeId}
                    onChange={setColorSchemeId}
                  />

                  {/* Extra Prompt */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Additional Prompts{" "}
                      <span className="text-zinc-400 text-xs">(optional)</span>
                    </label>

                    <textarea
                      value={additionalDetails}
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                      rows={3}
                      placeholder="Add any specific elements, mood, or style preferences..."
                      className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/6 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                    />
                  </div>
                </div>

                {/* Generate Button */}
                {!id && (
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="text-[15px] w-full py-3.5 rounded-xl font-medium bg-linear-to-b from-pink-500 to-pink-600 hover:from-pink-700 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Generating..." : "Generate Options"}
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div>
              <div className="p-6 rounded-2xl bg-white/8 border border-white/10 shadow-xl">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">
                  Preview
                </h2>

                {/* OPTIONS */}
                {options.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-zinc-100 font-semibold mb-3">
                      Choose your favorite thumbnail:
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      {options.map((url, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedOption(url)}
                          className={`group rounded-xl overflow-hidden border cursor-pointer transition
                            ${
                              selectedOption === url
                                ? "border-pink-500 ring-2 ring-pink-500/40"
                                : "border-white/10 hover:border-pink-400"
                            }
                          `}
                        >
                          <img
                            src={url}
                            alt={`Option ${index + 1}`}
                            className="w-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />

                          <div className="text-center text-xs text-zinc-300 py-2 bg-black/30">
                            Option {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-zinc-400 mt-2">
                      Select an option, then click Save Thumbnail.
                    </p>

                    {/* SAVE BUTTON */}
                    {selectedOption && (
                      <button
                        onClick={handleSaveThumbnail}
                        disabled={loading}
                        className="mt-4 w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-700 transition font-medium text-white"
                      >
                        {loading ? "Saving..." : "Save Thumbnail"}
                      </button>
                    )}
                  </div>
                )}

                {/* Preview Panel */}
                <PreviewPanel
                  thumbnail={thumbnail}
                  isLoading={loading}
                  aspectRatio={aspectRatio}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Generate;