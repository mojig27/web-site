// backend/src/controllers/order.controller.ts
import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
import { ApiError } from '../utils/ApiError';
import { initiatePayment } from '../services/payment.service';

export class OrderController {
  // ایجاد سفارش جدید
  async createOrder(req: Request, res: Response) {
    const { shippingAddress, paymentMethod } = req.body;

    // دریافت سبد خرید کاربر
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      throw new ApiError(400, 'سبد خرید خالی است');
    }

    // بررسی موجودی محصولات
    for (const item of cart.items) {
      const product = item.product as any;
      if (product.stock < item.quantity) {
        throw new ApiError(400, `موجودی محصول ${product.title} کافی نیست`);
      }
    }

    // محاسبه هزینه ارسال
    const shippingCost = await this.calculateShippingCost(shippingAddress);

    // ایجاد سفارش
    const order = new Order({
      user: req.user._id,
      items: cart.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress,
      totalPrice: cart.totalPrice + shippingCost,
      shippingCost,
      paymentMethod
    });

    await order.save();

    // کاهش موجودی محصولات
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // خالی کردن سبد خرید
    cart.items = [];
    await cart.save();

    // در صورت پرداخت آنلاین، ایجاد لینک پرداخت
    if (paymentMethod === 'online') {
      const paymentLink = await initiatePayment({
        amount: order.totalPrice,
        orderId: order._id,
        callbackUrl: `${process.env.FRONTEND_URL}/payment/verify`
      });

      return res.json({
        success: true,
        data: {
          orderId: order._id,
          paymentLink
        }
      });
    }

    res.json({
      success: true,
      data: order
    });
  }

  // محاسبه هزینه ارسال
  private async calculateShippingCost(address: any) {
    // در این مثال یک مقدار ثابت برمی‌گردانیم
    // در پروژه واقعی باید بر اساس استان و شهر محاسبه شود
    return 50000;
  }

  // دریافت سفارش‌های کاربر
  async getUserOrders(req: Request, res: Response) {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'title images');

    res.json({
      success: true,
      data: orders
    });
  }

  // دریافت جزئیات سفارش
  async getOrderDetails(req: Request, res: Response) {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('items.product');

    if (!order) {
      throw new ApiError(404, 'سفارش یافت نشد');
    }

    res.json({
      success: true,
      data: order
    });
  }

  // تایید پرداخت
  async verifyPayment(req: Request, res: Response) {
    const { orderId, status, transactionId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'سفارش یافت نشد');
    }

    if (status === 'success') {
      order.paymentStatus = 'paid';
      await order.save();

      res.json({
        success: true,
        data: order
      });
    } else {
      order.paymentStatus = 'failed';
      await order.save();

      // برگرداندن موجودی محصولات
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }

      throw new ApiError(400, 'پرداخت ناموفق بود');
    }
  }
}