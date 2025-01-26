// backend/src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { User } from '@/models/User';
import { ApiError } from '@/utils/ApiError';
import { catchAsync } from '@/utils/catchAsync';
import { createToken } from '@/utils/token';

export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // بررسی وجود کاربر
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'این ایمیل قبلاً ثبت شده است');
  }

  // ایجاد کاربر جدید
  const user = await User.create({
    name,
    email,
    password
  });

  const token = createToken(user._id);

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    }
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // بررسی وجود کاربر و صحت رمز عبور
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'ایمیل یا رمز عبور اشتباه است');
  }

  const token = createToken(user._id);

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    }
  });
});