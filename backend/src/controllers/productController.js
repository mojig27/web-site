// backend/src/controllers/productController.js
const Product = require('../models/Product');

// دریافت همه محصولات
exports.getAllProducts = async (req, res) => {
  try {
    const { category, sort, page = 1, limit = 10 } = req.query;
    const query = {};

    // اعمال فیلتر دسته‌بندی
    if (category) {
      query.category = category;
    }

    // تنظیمات مرتب‌سازی
    let sortOption = {};
    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    const products = await Product.find(query)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'name');

    const count = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت محصولات' });
  }
};

// افزودن محصول جدید
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, image, category, stock } = req.body;
    
    const product = new Product({
      title,
      description,
      price,
      image,
      category,
      stock,
      createdBy: req.user._id
    });

    await product.save();
    res.status(201).json({ message: 'محصول با موفقیت ایجاد شد', product });
  } catch (error) {
    res.status(500).json({ message: 'خطا در ایجاد محصول' });
  }
};

// به‌روزرسانی محصول
exports.updateProduct = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'price', 'image', 'category', 'stock', 'isAvailable'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'فیلدهای نامعتبر برای به‌روزرسانی' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'محصول یافت نشد' });
    }

    // بررسی دسترسی
    if (product.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'شما اجازه ویرایش این محصول را ندارید' });
    }

    updates.forEach(update => product[update] = req.body[update]);
    await product.save();

    res.json({ message: 'محصول با موفقیت به‌روز شد', product });
  } catch (error) {
    res.status(500).json({ message: 'خطا در به‌روزرسانی محصول' });
  }
};

// حذف محصول
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'محصول یافت نشد' });
    }

    // بررسی دسترسی
    if (product.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'شما اجازه حذف این محصول را ندارید' });
    }

    await product.remove();
    res.json({ message: 'محصول با موفقیت حذف شد' });
  } catch (error) {
    res.status(500).json({ message: 'خطا در حذف محصول' });
  }
};