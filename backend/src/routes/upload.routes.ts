// backend/src/routes/upload.routes.ts
import { Router } from 'express';
import multer from 'multer';
import { protect, restrictTo } from '@/middleware/auth';
import { uploadImage } from '@/controllers/upload.controller';

const router = Router();

const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('فقط تصاویر مجاز هستند'));
    }
  }
});

router.post(
  '/upload',
  protect,
  restrictTo('admin'),
  upload.single('image'),
  uploadImage
);

export default router;