// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@/models/User';
import { ApiError } from '@/utils/ApiError';
import { catchAsync } from '@/utils/catchAsync';

// گسترش تایپ Request برای اضافه کردن user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// میدلور محافظت از روت‌ها
export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 1) دریافت توکن
  let token: string | undefined;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'لطفاً وارد حساب کاربری خود شوید');
  }

  try {
    // 2) تایید توکن
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    // 3) بررسی وجود کاربر
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, 'کاربر متعلق به این توکن دیگر وجود ندارد');
    }

    // 4) اضافه کردن کاربر به درخواست
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, 'توکن نامعتبر است');
  }
});

// میدلور محدود کردن دسترسی بر اساس نقش
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, 'شما مجوز دسترسی به این بخش را ندارید');
    }
    next();
  };
};