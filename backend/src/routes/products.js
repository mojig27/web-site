// backend/src/routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// مسیرهای عمومی
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);

// مسیرهای نیازمند احراز هویت
router.use(auth);
router.post('/', adminAuth, productController.createProduct);
router.patch('/:id', adminAuth, productController.updateProduct);
router.delete('/:id', adminAuth, productController.deleteProduct);

module.exports = router;