import express from 'express';
import { deleteThumbnail } from '../controllers/ThumbnailController.js';
import protect from '../middlewares/auth.js';
import { updateThumbnailText } from "../controllers/ThumbnailController.js";
import {
  generateThumbnailOptions,
  finalizeThumbnail,
} from "../controllers/ThumbnailController.js";

const ThumbnailRouter = express.Router();

ThumbnailRouter.delete('/delete/:id',protect, deleteThumbnail)
ThumbnailRouter.patch("/:id", updateThumbnailText);
ThumbnailRouter.post("/generate-options", generateThumbnailOptions);
ThumbnailRouter.post("/finalize", finalizeThumbnail);

export default ThumbnailRouter;