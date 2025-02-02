// backend/src/controllers/product.controller.ts
import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { ApiError } from '../utils/ApiError';
import { ProductValidation } from '../validations/product.validation';

export class ProductController {
  // دریافت محصولات با فیلترهای پیشرفته
  async getProducts(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 12,
        category,
        subCategory,
        brand,
        minPrice,
        maxPrice,
        sort = 'createdAt',
        order = 'desc',
        search,
        inStock
      } = req.query;

      const query: any = {};

      // اعمال فیلترها
      if (category) query.category = category;
      if (subCategory) query.subCategory = subCategory;
      if (brand) query.brand = brand;
      if (inStock === 'true') query.stock = { $gt: 0 };
      
      // فیلتر قیمت
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      // جستجو در عنوان و توضیحات
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } }
        ];
      }

      const sortOptions: any = {};
      sortOptions[sort as string] = order === 'desc' ? -1 : 1;

      const skip = (Number(page) - 1) * Number(limit);

      const [products, total] = await Promise.all([
        Product.find(query)
          .sort(sortOptions)
          .skip(skip)
          .limit(Number(limit))
          .populate('createdBy', 'name'),
        Product.countDocuments(query)
      ]);

      res.json({
        success: true,
        data: {
          products,
          total,
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          hasMore: skip + products.length < total
        }
      });
    } catch (error) {
      throw new ApiError(500, 'خطا در دریافت محصولات');
    }
  }

  // افزودن محصول جدید
  async createProduct(req: Request, res: Response) {
    try {
      const validData = ProductValidation.parse(req.body);
      
      // اضافه کردن کاربر ایجاد کننده
      const product = new Product({
        ...validData,
        createdBy: req.user._id,
        updatedAt: new Date()
      });

      await product.save();

      res.status(201).json({
        success: true,
        data: product
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new ApiError(400, 'داده‌های نامعتبر', error.errors);
      }
      throw new ApiError(500, 'خطا در ایجاد محصول');
    }
  }

  // به‌روزرسانی محصول
  async updateProduct(req: Request, res: Response) {
    try {
      const validData = ProductValidation.partial().parse(req.body);
      
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          ...validData,
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!product) {
        throw new ApiError(404, 'محصول یافت نشد');
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new ApiError(400, 'داده‌های نامعتبر', error.errors);
      }
      throw new ApiError(500, 'خطا در به‌روزرسانی محصول');
    }
  }

  // دریافت محصولات مشابه
  async getRelatedProducts(req: Request, res: Response) {
    try {
      const product = await Product.findById(req.params.id);
      
      if (!product) {
        throw new ApiError(404, 'محصول یافت نشد');
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
    } catch (error) {
      throw new ApiError(500, 'خطا در دریافت محصولات مشابه');
    }
  }

  // جستجوی پیشرفته محصولات
  async searchProducts(req: Request, res: Response) {
    try {
      const { q, category, priceRange } = req.query;

      const query: any = {};

      if (q) {
        query.$text = { $search: q as string };
      }

      if (category) {
        query.category = category;
      }

      if (priceRange) {
        const [min, max] = (priceRange as string).split('-');
        query.price = {
          $gte: Number(min),
          $lte: Number(max)
        };
      }

      const products = await Product.find(query)
        .sort({ score: { $meta: 'textScore' } })
        .limit(20);

      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      throw new ApiError(500, 'خطا در جستجوی محصولات');
    }
  }
}