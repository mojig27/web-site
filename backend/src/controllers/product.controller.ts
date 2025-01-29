// backend/src/controllers/product.controller.ts
import { Request, Response } from 'express';
import { Product } from '@/models/Product';
import { ApiError } from '@/utils/ApiError';
import { catchAsync } from '@/utils/catchAsync';
import { ProductCategories } from '@/constants/categories';

// دریافت همه محصولات با قابلیت فیلتر و صفحه‌بندی
export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;
  const skip = (page - 1) * limit;

  const query: any = {};

  // فیلترهای پیشرفته
  if (req.query.category) {
    query.category = req.query.category;
  }
  if (req.query.brand) {
    query.brand = req.query.brand;
  }
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = parseInt(req.query.minPrice as string);
    if (req.query.maxPrice) query.price.$lte = parseInt(req.query.maxPrice as string);
  }
  if (req.query.material) {
    query['specifications.material'] = req.query.material;
  }
  if (req.query.color) {
    query['specifications.colors'] = req.query.color;
  }
  if (req.query.inStock === 'true') {
    query.stock = { $gt: 0 };
  }
  if (req.query.hasDiscount === 'true') {
    query.discount = { $exists: true };
  }

  // مرتب‌سازی
  let sortOption = {};
  switch (req.query.sort) {
    case 'price_asc':
      sortOption = { price: 1 };
      break;
    case 'price_desc':
      sortOption = { price: -1 };
      break;
    case 'newest':
      sortOption = { createdAt: -1 };
      break;
    case 'oldest':
      sortOption = { createdAt: 1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }

  const products = await Product.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
    .select('-createdBy');

  const total = await Product.countDocuments(query);

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

// دریافت محصول با شناسه
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
    createdBy: req.user.id
  });

  res.status(201).json({
    success: true,
    data: product
  });
});

// به‌روزرسانی محصول
export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new ApiError(404, 'محصول مورد نظر یافت نشد');
  }

  res.json({
    success: true,
    data: product
  });
});

// حذف محصول
export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    throw new ApiError(404, 'محصول مورد نظر یافت نشد');
  }

  res.status(204).json({
    success: true,
    data: null
  });
});

// دریافت دسته‌بندی‌ها
export const getCategories = catchAsync(async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: ProductCategories
  });
});

// دریافت محصولات مرتبط
export const getRelatedProducts = catchAsync(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    throw new ApiError(404, 'محصول مورد نظر یافت نشد');
  }

  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id }
  })
    .limit(4)
    .select('-createdBy');

  res.json({
    success: true,
    data: relatedProducts
  });
});