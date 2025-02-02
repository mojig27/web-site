// backend/src/models/Product.ts
import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  images: string[];  // آرایه‌ای از تصاویر
  category: string;
  subCategory: string;
  brand: string;
  specifications: {
    [key: string]: string | number;  // ویژگی‌های فنی محصول
  };
  stock: number;
  isAvailable: boolean;
  discount: {
    percentage: number;
    validUntil: Date;
  };
  ratings: {
    average: number;
    count: number;
  };
  tags: string[];
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  warranty: {
    months: number;
    description: string;
  };
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  title: { 
    type: String, 
    required: [true, 'عنوان محصول الزامی است'],
    index: true
  },
  description: { 
    type: String, 
    required: [true, 'توضیحات محصول الزامی است'] 
  },
  price: { 
    type: Number, 
    required: [true, 'قیمت محصول الزامی است'],
    min: [0, 'قیمت نمی‌تواند منفی باشد'] 
  },
  images: [{ 
    type: String,
    required: [true, 'حداقل یک تصویر الزامی است']
  }],
  category: { 
    type: String, 
    required: [true, 'دسته‌بندی محصول الزامی است'],
    enum: ['شیرآلات', 'سینک', 'هود', 'گاز', 'رادیاتور', 'آبگرمکن', 'کولر آبی', 'کولر گازی', 'لوله و اتصالات']
  },
  subCategory: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: [true, 'برند محصول الزامی است']
  },
  specifications: {
    type: Map,
    of: Schema.Types.Mixed
  },
  stock: { 
    type: Number, 
    required: true,
    min: 0,
    default: 0 
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  discount: {
    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    validUntil: Date
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  tags: [String],
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number
  },
  warranty: {
    months: Number,
    description: String
  },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
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

// ایندکس‌ها برای جستجوی بهتر
productSchema.index({ title: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ price: 1 });