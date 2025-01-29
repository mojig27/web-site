// backend/src/schemas/product.schema.ts
import { z } from 'zod';
import { ProductCategories } from '../constants/categories';

export const createProductSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(3, 'عنوان باید حداقل 3 کاراکتر باشد')
      .max(100, 'عنوان نمی‌تواند بیشتر از 100 کاراکتر باشد'),
    description: z
      .string()
      .min(10, 'توضیحات باید حداقل 10 کاراکتر باشد'),
    price: z
      .number()
      .min(0, 'قیمت نمی‌تواند منفی باشد'),
    images: z
      .array(z.string().url('آدرس تصویر نامعتبر است'))
      .min(1, 'حداقل یک تصویر الزامی است'),
    category: z
      .enum(Object.keys(ProductCategories) as [keyof typeof ProductCategories]),
    brand: z
      .string()
      .min(2, 'نام برند باید حداقل 2 کاراکتر باشد'),
    specifications: z.object({
      material: z.string().min(2, 'جنس محصول الزامی است'),
      dimensions: z.string().min(2, 'ابعاد محصول الزامی است'),
      colors: z.array(z.string()).min(1, 'حداقل یک رنگ باید مشخص شود'),
      warranty: z.string().min(2, 'مدت گارانتی الزامی است'),
      madeIn: z.string().min(2, 'کشور سازنده الزامی است')
    }),
    installationGuide: z.string().optional(),
    stock: z
      .number()
      .int('موجودی باید عدد صحیح باشد')
      .min(0, 'موجودی نمی‌تواند منفی باشد'),
    discount: z.object({
      percent: z.number().min(0).max(100),
      validUntil: z.date()
    }).optional()
  })
});

export const updateProductSchema = createProductSchema.partial();