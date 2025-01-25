// backend/src/controllers/cartController.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
                        .populate('items.product', 'title image price stock');
    
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت سبد خرید' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // بررسی موجودی محصول
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'محصول یافت نشد' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'موجودی محصول کافی نیست' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // بررسی وجود محصول در سبد خرید
    const existingItem = cart.items.find(item => 
      item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = product.price;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }

    cart.calculateTotal();
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'خطا در افزودن به سبد خرید' });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (quantity < 1) {
      return res.status(400).json({ message: 'تعداد باید بیشتر از صفر باشد' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'سبد خرید یافت نشد' });
    }

    const item = cart.items.find(item => 
      item.product.toString() === productId
    );
    if (!item) {
      return res.status(404).json({ message: 'محصول در سبد خرید یافت نشد' });
    }

    // بررسی موجودی
    const product = await Product.findById(productId);
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'موجودی محصول کافی نیست' });
    }

    item.quantity = quantity;
    item.price = product.price;
    cart.calculateTotal();
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'خطا در به‌روزرسانی سبد خرید' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'سبد خرید یافت نشد' });
    }

    cart.items = cart.items.filter(item => 
      item.product.toString() !== productId
    );

    cart.calculateTotal();
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'خطا در حذف از سبد خرید' });
  }
};