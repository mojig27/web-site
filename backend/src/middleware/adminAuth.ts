// backend/src/middleware/adminAuth.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    throw new ApiError(403, 'دسترسی غیرمجاز');
  }
};