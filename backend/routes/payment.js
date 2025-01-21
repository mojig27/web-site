const express = require('express');
const { createPayment, verifyPayment } = require('../services/paymentService');
const router = express.Router();

// Create a new payment
router.post('/request', async (req, res) => {
  try {
    const { amount, description, email, mobile } = req.body;
    const paymentUrl = await createPayment(amount, description, email, mobile);
    res.json({ paymentUrl });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Verify payment
router.get('/verify', async (req, res) => {
  try {
    const { Authority, Amount } = req.query;
    const response = await verifyPayment(Authority, Amount);

    if (response.status === 100) {
      res.json({ message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;