import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { authenticate, isAdmin } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/jpg',
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// Upload single image
router.post(
  '/image',
  authenticate,
  isAdmin,
  upload.single('image'),
  async (req: any, res: any, next: any) => {
    try {
      if (!req.file) {
        throw createError('No file uploaded', 400);
      }

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'gaming-store/products',
            transformation: [
              { width: 800, height: 800, crop: 'limit' },
              { quality: 'auto', fetch_format: 'auto' },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        uploadStream.end(req.file.buffer);
      });

      res.json({
        url: (result as any).secure_url,
        publicId: (result as any).public_id,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Upload multiple images
router.post(
  '/images',
  authenticate,
  isAdmin,
  upload.array('images', 5),
  async (req: any, res: any, next: any) => {
    try {
      if (!req.files || (req.files as any[]).length === 0) {
        throw createError('No files uploaded', 400);
      }

      const uploadPromises = (req.files as any[]).map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'gaming-store/products',
              transformation: [
                { width: 800, height: 800, crop: 'limit' },
                { quality: 'auto', fetch_format: 'auto' },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          uploadStream.end(file.buffer);
        });
      });

      const results = await Promise.all(uploadPromises);

      res.json({
        images: results.map((result: any) => ({
          url: result.secure_url,
          publicId: result.public_id,
        })),
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete image
router.delete('/image/:publicId', authenticate, isAdmin, async (req: any, res: any, next: any) => {
  try {
    const publicId = req.params.publicId.replace(/-/g, '/');

    await cloudinary.uploader.destroy(publicId);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
