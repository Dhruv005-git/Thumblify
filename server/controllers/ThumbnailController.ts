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

/* ---------------- GENERATE THUMBNAIL ---------------- */

export const generateThumbnail = async (req: Request, res: Response) => {
  try {
    console.log("\n===============================");
    console.log("🚀 THUMBNAIL GENERATION STARTED");
    console.log("===============================\n");

    const { userId } = req.session;

    if (!userId) {
      return res.status(401).json({ message: "User not logged in" });
    }

    const {
      title,
      prompt: user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
    } = req.body;

    console.log("📌 Request Body:", req.body);

    if (!process.env.RAPIDAPI_KEY) {
      return res.status(500).json({
        message: "RAPIDAPI_KEY is missing in environment variables",
      });
    }

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

    console.log("✅ Initial thumbnail record saved:", thumbnail._id);

    /* ---------------- BUILD FINAL PROMPT ---------------- */

    const finalPrompt = `
${stylePrompts[style as keyof typeof stylePrompts] || ""}

Scene related to: ${title}

${
  color_scheme
    ? colorSchemeDescriptions[
        color_scheme as keyof typeof colorSchemeDescriptions
      ]
    : ""
}

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

    console.log("\n📝 Final Prompt Preview:\n", finalPrompt.slice(0, 200));

    /* ---------------- RAPID API IMAGE GENERATION ---------------- */

    let response;

    try {
      console.log("🌍 Sending request to RapidAPI...");

      response = await axios.post(
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

      console.log("✅ RapidAPI Response Received!");
    } catch (err: any) {
      console.error("\n❌ RapidAPI Request Failed!");

      // ✅ QUOTA / LIMIT HANDLING
      if (err.response?.status === 429) {
        return res.status(429).json({
          message:
            "⚠️ AI generation limit reached. Please try again later.",
        });
      }

      return res.status(500).json({
        message: "RapidAPI request failed",
        error: err.response?.data || err.message,
      });
    }

    /* ---------------- EXTRACT IMAGE URL ---------------- */

    const imageUrl =
      response.data?.final_result?.[0]?.origin ||
      response.data?.result?.data?.results?.[0]?.origin ||
      response.data?.image ||
      response.data?.url;

    console.log("🖼 Extracted Image URL:", imageUrl);

    if (!imageUrl) {
      return res.status(500).json({
        message: "No image URL returned from RapidAPI",
        fullResponse: response.data,
      });
    }

    /* ---------------- UPLOAD TO CLOUDINARY ---------------- */

    console.log("\n☁ Uploading image to Cloudinary...");

    let uploadResult;

    try {
      uploadResult = await cloudinary.uploader.upload(imageUrl, {
        folder: "thumbnails",
      });

      console.log("✅ Cloudinary Upload Success!");
    } catch (err: any) {
      return res.status(500).json({
        message: "Cloudinary upload failed",
        error: err.message,
      });
    }

    /* ---------------- SAVE FINAL DATA ---------------- */

    thumbnail.image_url = uploadResult.secure_url;
    thumbnail.isGenerating = false;
    await thumbnail.save();

    res.json({
      message: "Thumbnail generated successfully",
      thumbnail,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Thumbnail generation failed",
      error: error.message,
    });
  }
};

/* ---------------- GENERATE OPTIONS ---------------- */

export const generateThumbnailOptions = async (req: Request, res: Response) => {
  try {
    console.log("\n===============================");
    console.log("🎨 OPTION GENERATION STARTED");
    console.log("===============================\n");

    const { title, prompt, style, aspect_ratio, color_scheme } = req.body;

    const finalPrompt = `
${stylePrompts[style as keyof typeof stylePrompts]}

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
professional YouTube thumbnail,
no text,
no watermark
`;

    let response;

    try {
      response = await axios.post(
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
    } catch (err: any) {
      console.error("\n❌ OPTION GENERATION FAILED!");

      // ✅ QUOTA LIMIT HANDLING
      if (err.response?.status === 429) {
        return res.status(429).json({
          message:
            "⚠️ Daily AI generation limit reached. Please try again later.",
        });
      }

      return res.status(500).json({
        message: "Option generation failed",
        error: err.message,
      });
    }

    /* ---------------- EXTRACT OPTIONS ---------------- */

    const options =
      response.data?.final_result?.map((img: any) => img.origin) || [];

    if (!options.length) {
      return res.status(500).json({
        message: "No options returned from RapidAPI",
        fullResponse: response.data,
      });
    }

    return res.json({
      message: "Options generated successfully",
      options,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Option generation failed",
      error: error.message,
    });
  }
};

/* ---------------- FINALIZE THUMBNAIL ---------------- */

export const finalizeThumbnail = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;

    const {
      selectedImageUrl,
      title,
      prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
    } = req.body;

    if (!selectedImageUrl) {
      return res.status(400).json({ message: "No image selected" });
    }

    const uploadResult = await cloudinary.uploader.upload(selectedImageUrl, {
      folder: "thumbnails",
      resource_type: "image",
    });

    const thumbnail = await Thumbnail.create({
      userId,
      title,
      user_prompt: prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
      image_url: uploadResult.secure_url,
      isGenerating: false,
    });

    res.json({
      message: "Thumbnail finalized successfully",
      thumbnail,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Finalization failed",
      error: err.message,
    });
  }
};

/* ---------------- DELETE THUMBNAIL ---------------- */

export const deleteThumbnail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.session;

    await Thumbnail.findOneAndDelete({ _id: id, userId });

    res.json({ message: "Thumbnail deleted successfully" });
  } catch (error: any) {
    res.status(500).json({
      message: "Delete failed",
      error: error.message,
    });
  }
};

/* ---------------- UPDATE TEXT ---------------- */

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
    res.status(500).json({
      message: "Update failed",
      error: err.message,
    });
  }
};
