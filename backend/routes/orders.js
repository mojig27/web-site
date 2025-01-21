const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { user, products, totalAmount } = req.body;
    const order = new Order({ user, products, totalAmount });
    await order.save();
    res.status(201).json({ message: 'Order created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all orders for a user
router.get('/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate('products.product');
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an order status
router.put('/:orderId', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.orderId, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;