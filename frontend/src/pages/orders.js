import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/orders/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Your Orders</h1>
      <ul>
        {orders.map(order => (
          <li key={order._id}>
            <h2>Order ID: {order._id}</h2>
            <p>Status: {order.status}</p>
            <p>Total Amount: ${order.totalAmount}</p>
            <ul>
              {order.products.map(product => (
                <li key={product.product._id}>
                  <p>{product.product.name} - Quantity: {product.quantity}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}