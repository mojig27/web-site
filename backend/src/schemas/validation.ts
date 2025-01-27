// src/schemas/validation.ts
import { z } from 'zod';

// اعتبارسنجی ورودی‌های ثبت‌نام
export const registerSchema = z.object({
  name: z.string()
    .min(2, 'نام باید حداقل 2 کاراکتر باشد')
    .max(50, 'نام نمی‌تواند بیشتر از 50 کاراکتر باشد'),
  email: z.string()
    .email('ایمیل نامعتبر است')
    .min(5, 'ایمیل باید حداقل 5 کاراکتر باشد')
    .max(100, 'ایمیل نمی‌تواند بیشتر از 100 کاراکتر باشد'),
  password: z.string()
    .min(6, 'رمز عبور باید حداقل 6 کاراکتر باشد')
    .max(100, 'رمز عبور نمی‌تواند بیشتر از 100 کاراکتر باشد')
});

// اعتبارسنجی ورودی‌های ورود
export const loginSchema = z.object({
  email: z.string()
    .email('ایمیل نامعتبر است'),
  password: z.string()
    .min(6, 'رمز عبور باید حداقل 6 کاراکتر باشد')
});

// اعتبارسنجی ورودی‌های محصول
export const productSchema = z.object({
  title: z.string()
    .min(3, 'عنوان باید حداقل 3 کاراکتر باشد')
    .max(100, 'عنوان نمی‌تواند بیشتر از 100 کاراکتر باشد'),
  description: z.string()
    .min(10, 'توضیحات باید حداقل 10 کاراکتر باشد')
    .max(1000, 'توضیحات نمی‌تواند بیشتر از 1000 کاراکتر باشد'),
  price: z.number()
    .min(0, 'قیمت نمی‌تواند منفی باشد'),
  image: z.string()
    .url('آدرس تصویر نامعتبر است'),
  category: z.string()
    .min(2, 'دسته‌بندی باید حداقل 2 کاراکتر باشد')
    .max(50, 'دسته‌بندی نمی‌تواند بیشتر از 50 کاراکتر باشد'),
  stock: z.number()
    .min(0, 'موجودی نمی‌تواند منفی باشد'),
  isAvailable: z.boolean().optional()
});

// اعتبارسنجی پارامترهای کوئری محصولات
export const productQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  isAvailable: z.string().optional(),
  sort: z.string().optional()
}).optional();