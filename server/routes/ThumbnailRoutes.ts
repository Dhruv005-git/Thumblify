import express from 'express';
import { deleteThumbnail, generateThumbnail } from '../controllers/ThumbnailController.js';
import protect from '../middlewares/auth.js';
import { updateThumbnailText } from "../controllers/ThumbnailController.js";


const ThumbnailRouter = express.Router();

ThumbnailRouter.post('/generate',protect,  generateThumbnail)
ThumbnailRouter.delete('/delete/:id',protect, deleteThumbnail)
ThumbnailRouter.patch("/:id", updateThumbnailText);


export default ThumbnailRouter;