const ZarinpalCheckout = require('zarinpal-checkout');

const zarinpal = ZarinpalCheckout.create('YOUR_MERCHANT_ID', true);

const createPayment = async (amount, description, email, mobile) => {
  try {
    const response = await zarinpal.PaymentRequest({
      Amount: amount,
      CallbackURL: 'http://localhost:5000/api/payment/verify',
      Description: description,
      Email: email,
      Mobile: mobile
    });

    if (response.status === 100) {
      return response.url;
    } else {
      throw new Error('Failed to create payment');
    }
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

const verifyPayment = async (authority, amount) => {
  try {
    const response = await zarinpal.PaymentVerification({
      Amount: amount,
      Authority: authority
    });

    return response;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

module.exports = {
  createPayment,
  verifyPayment
};