// backend/src/routes/product.routes.ts
import { Router } from 'express';
import { protect, authorize } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema
} from '@/schemas/product.schema';
import {
  createProduct,
  getProducts,
  updateProduct
} from '@/controllers/product.controller';

const router = Router();

router
  .route('/')
  .post(
    protect,
    authorize('admin'),
    validate(createProductSchema),
    createProduct
  )
  .get(
    validate(productQuerySchema),
    getProducts
  );

router
  .route('/:id')
  .patch(
    protect,
    validate(updateProductSchema),
    updateProduct
  );

export default router;