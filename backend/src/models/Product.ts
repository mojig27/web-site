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

export const Product = model<IProduct>('Product', productSchema);