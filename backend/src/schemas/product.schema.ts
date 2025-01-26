// backend/src/schemas/product.schema.ts
import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(2, 'عنوان باید حداقل 2 کاراکتر باشد')
      .max(100, 'عنوان نمی‌تواند بیشتر از 100 کاراکتر باشد'),
    description: z
      .string()
      .min(10, 'توضیحات باید حداقل 10 کاراکتر باشد')
      .max(1000, 'توضیحات نمی‌تواند بیشتر از 1000 کاراکتر باشد'),
    price: z
      .number()
      .min(0, 'قیمت نمی‌تواند منفی باشد'),
    image: z
      .string()
      .url('آدرس تصویر نامعتبر است'),
    category: z
      .string()
      .min(2, 'دسته‌بندی باید حداقل 2 کاراکتر باشد'),
    stock: z
      .number()
      .int('موجودی باید عدد صحیح باشد')
      .min(0, 'موجودی نمی‌تواند منفی باشد')
  })
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 10)),
    category: z.string().optional(),
    minPrice: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : undefined)),
    maxPrice: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : undefined)),
    sort: z
      .enum(['price_asc', 'price_desc', 'newest', 'oldest'])
      .optional()
      .default('newest')
  })
});