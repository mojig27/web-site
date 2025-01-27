// test/setup.ts
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

// تنظیم timeout برای تست‌ها
jest.setTimeout(30000);