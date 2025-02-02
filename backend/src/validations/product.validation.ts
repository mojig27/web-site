// backend/src/validations/product.validation.ts
import { z } from 'zod';

export const ProductValidation = z.object({
  title: z.string().min(3, 'عنوان باید حداقل 3 حرف باشد'),
  description: z.string().min(10, 'توضیحات باید حداقل 10 حرف باشد'),
  price: z.number().min(1000, 'قیمت باید حداقل 1000 تومان باشد'),
  images: z.array(z.string().url('آدرس تصویر معتبر نیست')).min(1, 'حداقل یک تصویر الزامی است'),
  category: z.enum([
    'شیرآلات',
    'سینک',
    'هود',
    'گاز',
    'رادیاتور',
    'آبگرمکن',
    'کولر آبی',
    'کولر گازی',
    'لوله و اتصالات'
  ]),
  subCategory: z.string(),
  brand: z.string(),
  specifications: z.record(z.string(), z.union([z.string(), z.number()])),
  stock: z.number().min(0, 'موجودی نمی‌تواند منفی باشد'),
  dimensions: z.object({
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    weight: z.number().optional()
  }).optional(),
  warranty: z.object({
    months: z.number(),
    description: z.string()
  }).optional()
});