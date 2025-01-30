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
// backend/src/controllers/ProductController.ts
import { Request, Response } from 'express';
import { Product, ProductValidation } from '../models/Product';
import { ApiError } from '../utils/ApiError';

export class ProductController {
  // دریافت همه محصولات با صفحه‌بندی
  async getProducts(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 12;
      const skip = (page - 1) * limit;

      const products = await Product.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Product.countDocuments();

      res.json({
        products,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit)
      });
    } catch (error) {
      throw new ApiError(500, 'خطا در دریافت محصولات');
    }
  }

  // افزودن محصول جدید
  async createProduct(req: Request, res: Response) {
    try {
      // اعتبارسنجی داده‌های ورودی
      const validData = ProductValidation.parse(req.body);
      
      const product = new Product(validData);
      await product.save();

      res.status(201).json({
        message: 'محصول با موفقیت ایجاد شد',
        product
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ApiError(400, 'داده‌های نامعتبر', error.errors);
      }
      throw new ApiError(500, 'خطا در ایجاد محصول');
    }
  }

  // به‌روزرسانی محصول
  async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validData = ProductValidation.parse(req.body);

      const product = await Product.findByIdAndUpdate(
        id,
        { ...validData, updatedAt: Date.now() },
        { new: true }
      );

      if (!product) {
        throw new ApiError(404, 'محصول یافت نشد');
      }

      res.json({
        message: 'محصول با موفقیت به‌روزرسانی شد',
        product
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ApiError(400, 'داده‌های نامعتبر', error.errors);
      }
      throw new ApiError(500, 'خطا در به‌روزرسانی محصول');
    }
  }
}