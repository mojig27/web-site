// src/database/seed.ts
import { connect, disconnect } from 'mongoose';
import { config } from 'dotenv';
import { Product } from '../models/Product';

config();

const initialProducts = [
  {
    name: 'محصول 1',
    price: 100000,
    description: 'توضیحات محصول 1',
    imageUrl: 'https://example.com/image1.jpg',
    category: 'دسته 1',
    stock: 10
  },
  // ... دیگر محصولات
];

async function seed() {
  try {
    await connect(process.env.MONGODB_URI!);
    console.log('📦 Connected to MongoDB');

    // پاک کردن داده‌های قبلی
    await Product.deleteMany({});
    console.log('🧹 Cleaned up old data');

    // افزودن داده‌های جدید
    await Product.insertMany(initialProducts);
    console.log('🌱 Seeded initial data');

    await disconnect();
    console.log('✅ Done');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();