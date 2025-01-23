const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// جستجوی محصولات
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    const products = await Product.find({ name: new RegExp(query, 'i') });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;