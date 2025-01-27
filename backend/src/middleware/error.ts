// src/middleware/error.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/utils/ApiError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'خطای سرور'
  });
};