// src/database/migrate.ts
import { connect, disconnect } from 'mongoose';
import { config } from 'dotenv';
import { createTables } from './schemas';

config(); // لود کردن متغیرهای محیطی

async function migrate() {
  try {
    // اتصال به دیتابیس
    await connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/web-site');
    console.log('📦 Connected to MongoDB');

    // ایجاد جداول
    await createTables();
    console.log('✅ Tables created successfully');

    await disconnect();
    console.log('📦 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();