// backend/src/config/security.ts
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

export const configSecurity = (app: Express) => {
  // محافظت در برابر حملات متداول
  app.use(helmet());

  // محدودیت تعداد درخواست
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقیقه
    max: 100, // حداکثر 100 درخواست
    message: 'تعداد درخواست‌های شما بیش از حد مجاز است'
  }));

  // تنظیمات CORS
  app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  }));
};