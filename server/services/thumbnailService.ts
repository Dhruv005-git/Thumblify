import axios from "axios";
import Thumbnail from "../models/Thumbnail.js";
import { v2 as cloudinary } from "cloudinary";

const buildPrompt = (data: any) => {
  const { title, prompt, style, color_scheme } = data;

  return `
${stylePrompts[style as keyof typeof stylePrompts] || ""}

Scene related to: ${title}

${
  color_scheme
    ? colorSchemeDescriptions[
        color_scheme as keyof typeof colorSchemeDescriptions
      ]
    : ""
}

${prompt || ""}

cinematic lighting,
clean composition,
no text,
no watermark
`;
};

const generateImageFromAPI = async (finalPrompt: string, aspect_ratio: string) => {
  const response = await axios.post(
    "https://ai-text-to-image-generator-flux-free-api.p.rapidapi.com/aaaaaaaaaaaaaaaaaiimagegenerator/quick.php",
    {
      prompt: finalPrompt,
      style_id: 4,
      size: aspect_ratio === "1:1" ? "1-1" : "16-9",
    },
    {
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host":
          "ai-text-to-image-generator-flux-free-api.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      timeout: 60000,
    }
  );

  return response.data;
};

const extractImageUrl = (data: any) => {
  return (
    data?.final_result?.[0]?.origin ||
    data?.result?.data?.results?.[0]?.origin ||
    data?.image ||
    data?.url
  );
};

/* ---------------- PROMPT MAPS ---------------- */

const stylePrompts = {
  "Bold & Graphic":
    "bold YouTube thumbnail background, dramatic lighting, high contrast, eye catching composition",
  "Tech/Futuristic":
    "futuristic tech themed background, neon glow, cyber style lighting",
  Minimalist: "minimal clean background, soft lighting, modern design",
  Photorealistic:
    "realistic cinematic scene, natural lighting, shallow depth of field",
  Illustrated:
    "digital illustration style background, smooth shading, creative artwork",
};

const colorSchemeDescriptions = {
  vibrant: "vibrant energetic colors",
  sunset: "warm orange pink sunset tones",
  forest: "natural green earthy tones",
  neon: "neon blue pink glow",
  purple: "purple magenta aesthetic",
  monochrome: "black and white high contrast",
  ocean: "cool blue teal tones",
  pastel: "soft pastel colors",
};

export const generateOptionsService = async (data: any) => {
  const finalPrompt = buildPrompt(data);

  const apiData = await generateImageFromAPI(finalPrompt, data.aspect_ratio);

  const options =
    apiData?.final_result?.map((img: any) => img.origin) || [];

  if (!options.length) throw new Error("NO_OPTIONS");

  return options;
};