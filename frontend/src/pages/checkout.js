import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Checkout() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const router = useRouter();

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/payment/request', {
        amount,
        description,
        email,
        mobile
      });
      const { paymentUrl } = response.data;
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  return (
    <form onSubmit={handlePayment}>
      <h1>Checkout</h1>
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="tel"
        placeholder="Mobile"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      <button type="submit">Pay</button>
    </form>
  );
}