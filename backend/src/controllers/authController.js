// backend/src/controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // بررسی وجود کاربر
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'این ایمیل قبلاً ثبت شده است' });
    }

    // ایجاد کاربر جدید
    const user = new User({
      name,
      email,
      password
    });
    await user.save();

    // ایجاد توکن
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'ثبت نام با موفقیت انجام شد',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'خطا در ثبت نام' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // پیدا کردن کاربر
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'ایمیل یا رمز عبور اشتباه است' });
    }

    // بررسی پسورد
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'ایمیل یا رمز عبور اشتباه است' });
    }

    // ایجاد توکن
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'خطا در ورود' });
  }
};