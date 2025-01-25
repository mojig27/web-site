// backend/src/index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// تنظیمات امنیتی
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));

// محدودیت درخواست‌ها
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقیقه
  max: 100 // حداکثر 100 درخواست از هر IP
});
app.use('/api/', limiter);

// Middleware ها
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// مسیرها
app.use('/api/auth', require('./routes/auth'));

// اتصال به دیتابیس
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('اتصال به MongoDB برقرار شد'))
  .catch(err => console.error('خطا در اتصال به MongoDB:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`سرور در پورت ${PORT} در حال اجراست`);
});