// backend/src/utils/token.ts
import jwt from 'jsonwebtoken';
import { ApiError } from './ApiError';

export const createToken = (userId: string): string => {
  try {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );
  } catch (error) {
    throw new ApiError(500, 'خطا در ایجاد توکن');
  }
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
  } catch (error) {
    throw new ApiError(401, 'توکن نامعتبر است');
  }
};