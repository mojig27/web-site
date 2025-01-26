// backend/src/schemas/auth.schema.ts
import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'نام باید حداقل 2 کاراکتر باشد')
      .max(50, 'نام نمی‌تواند بیشتر از 50 کاراکتر باشد'),
    email: z
      .string()
      .email('ایمیل نامعتبر است')
      .min(1, 'ایمیل الزامی است'),
    password: z
      .string()
      .min(6, 'رمز عبور باید حداقل 6 کاراکتر باشد')
      .max(50, 'رمز عبور نمی‌تواند بیشتر از 50 کاراکتر باشد'),
    confirmPassword: z
      .string()
      .min(1, 'تکرار رمز عبور الزامی است')
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'رمز عبور و تکرار آن باید یکسان باشند',
    path: ['confirmPassword']
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('ایمیل نامعتبر است')
      .min(1, 'ایمیل الزامی است'),
    password: z
      .string()
      .min(1, 'رمز عبور الزامی است')
  })
});