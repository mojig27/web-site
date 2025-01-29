// backend/src/models/Product.ts
import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  title: string;                 // نام محصول
  description: string;           // توضیحات
  price: number;                 // قیمت
  images: string[];             // آرایه‌ای از تصاویر
  category: string;             // دسته‌بندی
  brand: string;                // برند
  specifications: {
    material: string;           // جنس محصول
    dimensions: string;         // ابعاد
    colors: string[];          // رنگ‌های موجود
    warranty: string;          // گارانتی
    madeIn: string;           // کشور سازنده
  };
  installationGuide?: string;   // راهنمای نصب
  stock: number;                // موجودی
  discount?: {
    percent: number;
    validUntil: Date;
  };
  isAvailable: boolean;         // وضعیت موجودی
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
}

const productSchema = new Schema<IProduct>({
  title: { 
    type: String, 
    required: [true, 'عنوان محصول الزامی است'],
    trim: true
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
    required: [true, 'حداقل یک تصویر برای محصول الزامی است'] 
  }],
  category: { 
    type: String, 
    required: [true, 'دسته‌بندی محصول الزامی است'] 
  },
  brand: {
    type: String,
    required: [true, 'برند محصول الزامی است']
  },
  specifications: {
    material: {
      type: String,
      required: [true, 'جنس محصول الزامی است']
    },
    dimensions: {
      type: String,
      required: [true, 'ابعاد محصول الزامی است']
    },
    colors: [{
      type: String,
      required: [true, 'حداقل یک رنگ باید مشخص شود']
    }],
    warranty: {
      type: String,
      required: [true, 'مدت گارانتی الزامی است']
    },
    madeIn: {
      type: String,
      required: [true, 'کشور سازنده الزامی است']
    }
  },
  installationGuide: {
    type: String
  },
  stock: { 
    type: Number, 
    required: true,
    min: 0,
    default: 0 
  },
  discount: {
    percent: {
      type: Number,
      min: 0,
      max: 100
    },
    validUntil: {
      type: Date
    }
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const Product = model<IProduct>('Product', productSchema);