// src/controllers/product.controller.ts
import { Request, Response } from 'express';
import { Product } from '@/models/Product';
import { ApiError } from '@/utils/ApiError';
import { catchAsync } from '@/utils/catchAsync';

// دریافت همه محصولات با قابلیت فیلتر و صفحه‌بندی
export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const query = Product.find();

  // اعمال فیلترها
  if (req.query.category) {
    query.where('category').equals(req.query.category);
  }
  if (req.query.minPrice) {
    query.where('price').gte(parseInt(req.query.minPrice as string));
  }
  if (req.query.maxPrice) {
    query.where('price').lte(parseInt(req.query.maxPrice as string));
  }
  if (req.query.isAvailable) {
    query.where('isAvailable').equals(req.query.isAvailable === 'true');
  }

  // اعمال مرتب‌سازی
  if (req.query.sort) {
    const sortField = (req.query.sort as string).replace('-', '');
    const sortOrder = (req.query.sort as string).startsWith('-') ? -1 : 1;
    query.sort({ [sortField]: sortOrder });
  } else {
    query.sort('-createdAt');
  }

  const products = await query.skip(skip).limit(limit);
  const total = await Product.countDocuments(query.getFilter());

  res.json({
    success: true,
    data: {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// دریافت یک محصول با شناسه
export const getProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    throw new ApiError(404, 'محصول مورد نظر یافت نشد');
  }

  res.json({
    success: true,
    data: product
  });
});

// ایجاد محصول جدید
export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await Product.create({
    ...req.body,
    createdBy: req.user.id // از میدلور auth اضافه می‌شود
  });

  res.status(201).json({
    success: true,
    data: product
  });
});

// به‌روزرسانی محصول
export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, 'محصول مورد نظر یافت نشد');
  }

  // بررسی دسترسی (فقط ادمین یا سازنده محصول)
  if (req.user.role !== 'admin' && product.createdBy.toString() !== req.user.id) {
    throw new ApiError(403, 'شما اجازه ویرایش این محصول را ندارید');
  }

  // به‌روزرسانی فیلدهای مجاز
  Object.assign(product, {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    image: req.body.image,
    category: req.body.category,
    stock: req.body.stock,
    isAvailable: req.body.isAvailable
  });

  await product.save();

  res.json({
    success: true,
    data: product
  });
});

// حذف محصول
export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, 'محصول مورد نظر یافت نشد');
  }

  // بررسی دسترسی (فقط ادمین یا سازنده محصول)
  if (req.user.role !== 'admin' && product.createdBy.toString() !== req.user.id) {
    throw new ApiError(403, 'شما اجازه حذف این محصول را ندارید');
  }

  await product.deleteOne();

  res.json({
    success: true,
    message: 'محصول با موفقیت حذف شد'
  });
});