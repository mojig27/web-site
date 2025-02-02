// backend/src/models/Cart.ts
import { Schema, model, Document } from 'mongoose';

export interface ICartItem {
  product: Schema.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface ICart extends Document {
  user: Schema.Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const cartSchema = new Schema<ICart>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalPrice: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// محاسبه خودکار قیمت کل
cartSchema.pre('save', function(next) {
  this.totalPrice = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  next();
});

export const Cart = model<ICart>('Cart', cartSchema);

// backend/src/controllers/cart.controller.ts
import { Request, Response } from 'express';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
import { ApiError } from '../utils/ApiError';

export class CartController {
  // دریافت سبد خرید کاربر
  async getCart(req: Request, res: Response) {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'title images price stock');

    if (!cart) {
      return res.json({
        success: true,
        data: { items: [], totalPrice: 0 }
      });
    }

    res.json({
      success: true,
      data: cart
    });
  }

  // افزودن محصول به سبد خرید
  async addToCart(req: Request, res: Response) {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, 'محصول یافت نشد');
    }

    if (product.stock < quantity) {
      throw new ApiError(400, 'موجودی محصول کافی نیست');
    }

    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: []
      });
    }

    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = product.price;
    } else {
      cart.items.push({
        product: product._id,
        quantity,
        price: product.price
      });
    }

    await cart.save();
    await cart.populate('items.product', 'title images price stock');

    res.json({
      success: true,
      data: cart
    });
  }

  // به‌روزرسانی تعداد محصول
  async updateQuantity(req: Request, res: Response) {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      throw new ApiError(400, 'تعداد باید بزرگتر از صفر باشد');
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, 'محصول یافت نشد');
    }

    if (product.stock < quantity) {
      throw new ApiError(400, 'موجودی محصول کافی نیست');
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      throw new ApiError(404, 'سبد خرید یافت نشد');
    }

    const item = cart.items.find(
      item => item.product.toString() === productId
    );

    if (!item) {
      throw new ApiError(404, 'محصول در سبد خرید یافت نشد');
    }

    item.quantity = quantity;
    item.price = product.price;

    await cart.save();
    await cart.populate('items.product', 'title images price stock');

    res.json({
      success: true,
      data: cart
    });
  }

  // حذف محصول از سبد خرید
  async removeFromCart(req: Request, res: Response) {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      throw new ApiError(404, 'سبد خرید یافت نشد');
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate('items.product', 'title images price stock');

    res.json({
      success: true,
      data: cart
    });
  }

  // خالی کردن سبد خرید
  async clearCart(req: Request, res: Response) {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({
      success: true,
      data: { items: [], totalPrice: 0 }
    });
  }
}