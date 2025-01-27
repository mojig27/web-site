// src/routes/auth.routes.ts
import { Router } from 'express';
import { login, register, getProfile } from '@/controllers/auth.controller';
import { protect } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { loginSchema, registerSchema } from '@/schemas/validation';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: ثبت‌نام کاربر جدید
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: کاربر نمونه
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       201:
 *         description: ثبت‌نام موفق
 *       400:
 *         description: خطای اعتبارسنجی
 */
router.post('/register', validate(registerSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: ورود کاربر
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: ورود موفق
 *       401:
 *         description: نام کاربری یا رمز عبور اشتباه
 */
router.post('/login', validate(loginSchema), login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     tags: [Authentication]
 *     summary: دریافت پروفایل کاربر
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: دریافت موفق اطلاعات پروفایل
 *       401:
 *         description: عدم احراز هویت
 */
router.get('/profile', protect, getProfile);

export default router;