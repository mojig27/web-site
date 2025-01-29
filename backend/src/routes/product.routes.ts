// backend/src/routes/product.routes.ts
import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getRelatedProducts
} from '@/controllers/product.controller';
import { protect, restrictTo } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { createProductSchema, updateProductSchema, productQuerySchema } from '@/schemas/product.schema';

const router = Router();

// مسیرهای عمومی
router.get('/', validate(productQuerySchema), getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);
router.get('/:id/related', getRelatedProducts);

// مسیرهای محافظت شده (نیاز به احراز هویت)
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', validate(createProductSchema), createProduct);
router.patch('/:id', validate(updateProductSchema), updateProduct);
router.delete('/:id', deleteProduct);

export default router;