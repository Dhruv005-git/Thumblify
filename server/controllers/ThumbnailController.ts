import { Request, Response } from "express";
import Thumbnail from "../models/Thumbnail.js";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";

/* ---------------- PROMPT MAPS ---------------- */

const stylePrompts = {
  "Bold & Graphic":
    "bold YouTube thumbnail background, dramatic lighting, high contrast, eye catching composition",
  "Tech/Futuristic":
    "futuristic tech themed background, neon glow, cyber style lighting",
  Minimalist:
    "minimal clean background, soft lighting, modern design",
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

/* ---------------- CONTROLLER ---------------- */

export const generateThumbnail = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;

    const {
      title,
      prompt: user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
    } = req.body;

    /* ---------------- SAVE INITIAL RECORD ---------------- */

    const thumbnail = await Thumbnail.create({
      userId,
      title,
      user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
      isGenerating: true,
    });

    /* ---------------- BUILD FINAL PROMPT ---------------- */

    let finalPrompt = `
${stylePrompts[style as keyof typeof stylePrompts]}.

Scene related to: ${title}.

${color_scheme ? colorSchemeDescriptions[color_scheme as keyof typeof colorSchemeDescriptions] : ""}.

${user_prompt || ""}

cinematic lighting,
clean composition,
empty space for text,
professional YouTube thumbnail background,
high contrast,
no text,
no letters,
no logos,
no watermark
`;

    /* ---------------- RAPID API IMAGE GENERATION ---------------- */

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
      }
    );

    const imageUrl =
      response.data?.result?.data?.results?.[0]?.origin;

    if (!imageUrl) {
      throw new Error("Image generation failed");
    }

    /* ---------------- UPLOAD TO CLOUDINARY ---------------- */

    const uploadResult = await cloudinary.uploader.upload(imageUrl, {
      folder: "thumbnails",
    });

    /* ---------------- SAVE FINAL DATA ---------------- */

    thumbnail.image_url = uploadResult.secure_url;
    thumbnail.isGenerating = false;
    await thumbnail.save();

    res.json({
      message: "Thumbnail generated successfully",
      thumbnail,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Thumbnail generation failed",
      error: error.message,
    });
  }
};

/* ---------------- DELETE ---------------- */

export const deleteThumbnail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.session;

    await Thumbnail.findOneAndDelete({ _id: id, userId });

    res.json({ message: "Thumbnail deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateThumbnailText = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const {
      text_overlay,
      text_pos_x,
      text_pos_y,
      text_size_pct,
      text_font,
      text_color,
    } = req.body;

    const updated = await Thumbnail.findByIdAndUpdate(
      id,
      {
        text_overlay,
        text_pos_x,
        text_pos_y,
        text_size_pct,
        text_font,
        text_color,
      },
      { new: true, runValidators: true }
    );

    res.json({ thumbnail: updated });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
