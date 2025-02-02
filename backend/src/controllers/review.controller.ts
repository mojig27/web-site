// backend/src/controllers/review.controller.ts
import { Request, Response } from 'express';
import { Review } from '../models/Review';
import { Order } from '../models/Order';
import { ApiError } from '../utils/ApiError';

export class ReviewController {
  // ثبت نظر جدید
  async createReview(req: Request, res: Response) {
    const { productId } = req.params;
    const { rating, comment, advantages, disadvantages, images } = req.body;

    // بررسی خرید محصول توسط کاربر
    const order = await Order.findOne({
      user: req.user._id,
      'items.product': productId,
      orderStatus: 'delivered'
    });

    // بررسی تکراری نبودن نظر
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId
    });

    if (existingReview) {
      throw new ApiError(400, 'شما قبلاً برای این محصول نظر ثبت کرده‌اید');
    }

    const review = new Review({
      user: req.user._id,
      product: productId,
      order: order?._id,
      rating,
      comment,
      advantages,
      disadvantages,
      images,
      buyerVerified: !!order
    });

    await review.save();

    res.status(201).json({
      success: true,
      data: review
    });
  }

  // دریافت نظرات محصول
  async getProductReviews(req: Request, res: Response) {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = 'createdAt' } = req.query;

    const reviews = await Review.find({
      product: productId,
      status: 'approved'
    })
      .populate('user', 'name')
      .sort({ [sort as string]: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Review.countDocuments({
      product: productId,
      status: 'approved'
    });

    res.json({
      success: true,
      data: {
        reviews,
        total,
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  }

  // لایک کردن نظر
  async likeReview(req: Request, res: Response) {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!review) {
      throw new ApiError(404, 'نظر یافت نشد');
    }

    res.json({
      success: true,
      data: review
    });
  }

  // گزارش نظر نامناسب
  async reportReview(req: Request, res: Response) {
    const { reviewId } = req.params;
    const { reason } = req.body;

    // در اینجا می‌توانید گزارش را در سیستم ثبت کنید
    // و به ادمین اطلاع دهید

    res.json({
      success: true,
      message: 'گزارش شما با موفقیت ثبت شد'
    });
  }
}