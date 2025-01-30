// backend/src/models/Product.ts
import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  isAvailable: boolean;
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
}

const productSchema = new Schema<IProduct>({
  title: { 
    type: String, 
    required: [true, 'عنوان محصول الزامی است'] 
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
  image: { 
    type: String, 
    required: [true, 'تصویر محصول الزامی است'] 
  },
  category: { 
    type: String, 
    required: [true, 'دسته‌بندی محصول الزامی است'] 
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
// backend/src/models/Product.ts
import mongoose from 'mongoose';
import { z } from 'zod';

// Schema اعتبارسنجی با Zod
export const ProductValidation = z.object({
  name: z.string().min(2, 'نام محصول باید حداقل 2 حرف باشد'),
  price: z.number().min(1000, 'قیمت باید حداقل 1000 تومان باشد'),
  description: z.string(),
  imageUrl: z.string().url('آدرس تصویر معتبر نیست'),
  category: z.string(),
  stock: z.number().min(0, 'موجودی نمی‌تواند منفی باشد')
});

// مدل mongoose
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  imageUrl: String,
  category: String,
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Product = mongoose.model('Product', productSchema);

export const Product = model<IProduct>('Product', productSchema);