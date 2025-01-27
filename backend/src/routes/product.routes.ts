// src/routes/product.routes.ts
import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} from '@/controllers/product.controller';
import { protect, restrictTo } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { productSchema, productQuerySchema } from '@/schemas/validation';

const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: دریافت لیست محصولات
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: شماره صفحه
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: تعداد آیتم در هر صفحه
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: فیلتر بر اساس دسته‌بندی
 *     responses:
 *       200:
 *         description: دریافت موفق لیست محصولات
 */
router.route('/')
  .get(validate(productQuerySchema), getProducts)
  /**
   * @swagger
   * /api/products:
   *   post:
   *     tags: [Products]
   *     summary: ایجاد محصول جدید
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Product'
   *     responses:
   *       201:
   *         description: محصول با موفقیت ایجاد شد
   *       401:
   *         description: عدم احراز هویت
   *       403:
   *         description: عدم دسترسی
   */
  .post(protect, restrictTo('admin'), validate(productSchema), createProduct);

// ... سایر روت‌ها با مستندات مشابه