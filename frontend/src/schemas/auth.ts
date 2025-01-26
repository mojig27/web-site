// frontend/src/schemas/auth.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'ایمیل الزامی است')
    .email('فرمت ایمیل صحیح نیست'),
  password: z
    .string()
    .min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد')
    .max(50, 'رمز عبور نمی‌تواند بیشتر از ۵۰ کاراکتر باشد')
});

export const registerSchema = loginSchema.extend({
  name: z
    .string()
    .min(2, 'نام باید حداقل ۲ کاراکتر باشد')
    .max(50, 'نام نمی‌تواند بیشتر از ۵۰ کاراکتر باشد'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "رمز عبور و تکرار آن باید یکسان باشند",
  path: ["confirmPassword"]
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;