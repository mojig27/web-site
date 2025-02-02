// backend/src/models/Order.ts
import { Schema, model, Document } from 'mongoose';

export interface IOrderItem {
  product: Schema.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IShippingAddress {
  province: string;
  city: string;
  address: string;
  postalCode: string;
  receiver: {
    name: string;
    phone: string;
  };
}

export interface IOrder extends Document {
  user: Schema.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  totalPrice: number;
  shippingCost: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'processing' | 'shipping' | 'delivered' | 'canceled';
  trackingCode?: string;
  paymentMethod: 'online' | 'wallet';
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  shippingAddress: {
    province: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true,
      match: [/^\d{10}$/, 'کد پستی معتبر نیست']
    },
    receiver: {
      name: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true,
        match: [/^09\d{9}$/, 'شماره موبایل معتبر نیست']
      }
    }
  },
  totalPrice: {
    type: Number,
    required: true
  },
  shippingCost: {
    type: Number,
    required: true,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['processing', 'shipping', 'delivered', 'canceled'],
    default: 'processing'
  },
  trackingCode: String,
  paymentMethod: {
    type: String,
    enum: ['online', 'wallet'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export const Order = model<IOrder>('Order', orderSchema);