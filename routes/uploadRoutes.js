import express from 'express';
import { upload } from '../config/cloudinary.js';
import { uploadImage } from '../controllers/uploadController.js';
import { uploadLogger } from '../middleware/uploadLogger.js';

const router = express.Router();

// Upload image to Cloudinary
router.post('/', uploadLogger, upload.single('image'), uploadImage);

export default router;

