// backend/src/controllers/product.controller.ts
import { Request, Response } from 'express';
import { Product } from '@/models/Product';
import { ApiError } from '@/utils/ApiError';
import { catchAsync } from '@/utils/catchAsync';

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await Product.create({
    ...req.body,
    createdBy: req.user!.id
  });

  res.status(201).json({
    success: true,
    data: product
  });
});

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const { 
    page = 1, 
    limit = 10,
    category,
    minPrice,
    maxPrice,
    sort
  } = req.query;

  // ساخت query
  const query: any = {};
  
  if (category) {
    query.category = category;
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = minPrice;
    if (maxPrice) query.price.$lte = maxPrice;
  }

  // ساخت sort
  let sortQuery = {};
  switch (sort) {
    case 'price_asc':
      sortQuery = { price: 1 };
      break;
    case 'price_desc':
      sortQuery = { price: -1 };
      break;
    case 'oldest':
      sortQuery = { createdAt: 1 };
      break;
    default:
      sortQuery = { createdAt: -1 };
  }

  const products = await Product.find(query)
    .sort(sortQuery)
    .skip((+page - 1) * +limit)
    .limit(+limit);

  const total = await Product.countDocuments(query);

  res.json({
    success: true,
    data: {
      products,
      totalPages: Math.ceil(total / +limit),
      currentPage: +page,
      totalProducts: total
    }
  });
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, 'محصول یافت نشد');
  }

  // بررسی دسترسی
  if (product.createdBy.toString() !== req.user!.id && req.user!.role !== 'admin') {
    throw new ApiError(403, 'شما اجازه ویرایش این محصول را ندارید');
  }

  Object.assign(product, req.body);
  await product.save();

  res.json({
    success: true,
    data: product
  });
});