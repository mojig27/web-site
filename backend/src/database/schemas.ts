// src/database/schemas.ts
import mongoose from 'mongoose';

export async function createTables() {
  // Product Schema
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

  // User Schema
  const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now }
  });

  // Order Schema
  const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    products: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      price: Number
    }],
    total: Number,
    status: { 
      type: String, 
      enum: ['pending', 'paid', 'shipped', 'delivered'], 
      default: 'pending' 
    },
    createdAt: { type: Date, default: Date.now }
  });

  // ایجاد مدل‌ها
  const models = {
    Product: mongoose.model('Product', productSchema),
    User: mongoose.model('User', userSchema),
    Order: mongoose.model('Order', orderSchema)
  };

  return models;
}