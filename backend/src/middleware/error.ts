// backend/src/middleware/error.ts
import { Request, Response, NextFunction } from 'express';
import { MongoError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';
import { ApiError } from '@/utils/ApiError';

interface ErrorResponse {
  status: string;
  message: string;
  errors?: any;
  stack?: string;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  // خطاهای Mongoose
  if (err instanceof MongooseError.CastError) {
    error = new ApiError(400, 'مقدار وارد شده نامعتبر است');
  }

  if (err instanceof MongooseError.ValidationError) {
    const errors = Object.values(err.errors).map(val => val.message);
    error = new ApiError(400, 'داده‌های ورودی نامعتبر هستند');
    (error as any).errors = errors;
  }

  // خطای Duplicate (MongoDB)
  if (err instanceof MongoError && err.code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    error = new ApiError(400, `این ${field} قبلاً ثبت شده است`);
  }

  const errorResponse: ErrorResponse = {
    status: (error as ApiError).status || 'error',
    message: error.message || 'خطای سرور',
  };

  if ((error as ApiError).errors) {
    errorResponse.errors = (error as ApiError).errors;
  }

  // نمایش stack trace فقط در محیط توسعه
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack;
  }

  res.status((error as ApiError).statusCode || 500).json(errorResponse);
};