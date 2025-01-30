// backend/src/utils/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from './ApiError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      errors: err.errors
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'خطای سرور'
  });
};

// در app.ts
app.use(errorHandler);