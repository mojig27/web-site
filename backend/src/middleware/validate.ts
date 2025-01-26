// backend/src/middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { ApiError } from '@/utils/ApiError';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error: any) {
      const errors = error.errors.map((e: any) => e.message);
      next(new ApiError(400, 'داده‌های ورودی نامعتبر هستند', errors));
    }
  };
};