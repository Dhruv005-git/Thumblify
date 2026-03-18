import { Request, Response } from "express";
import Thumbnail from "../models/Thumbnail.js";
import { v2 as cloudinary } from "cloudinary";
import { generateOptionsService } from "../services/thumbnailService.js";

/* ---------------- GENERATE OPTIONS ---------------- */

export const generateThumbnailOptions = async (req: Request, res: Response) => {
  try {
    const options = await generateOptionsService(req.body);

    res.json({
      message: "Options generated successfully",
      options,
    });
  } catch (error: any) {
    if (error.message === "NO_OPTIONS") {
      return res.status(500).json({
        message: "No options returned from API",
      });
    }

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