// frontend/src/pages/cart.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';

export default function Cart() {
  // این داده‌ها باید از یک state manager مثل Redux یا Context مدیریت شوند
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      title: 'گوشی هوشمند سامسونگ',
      price: 12500000,
      image: '/images/product1.jpg',
      quantity: 1,
    },
    {
      id: '2',
      title: 'لپ تاپ ایسوس',
      price: 45000000,
      image: '/images/product2.jpg',
      quantity: 1,
    },
  ]);

  const updateQuantity = (id: string, newQuantity: number) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
    ));
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">سبد خرید</h1>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm"
              >
                <div className="relative w-24 h-24 rounded-md overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.title}</h3>
                  <div className="text-blue-600 mt-1">
                    {new Intl.NumberFormat('fa-IR').format(item.price)} تومان
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="p-1 hover:bg-gray-100 rounded transition"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <FiMinus />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    className="p-1 hover:bg-gray-100 rounded transition"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <FiPlus />
                  </button>
                </div>
                <button
                  className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                  onClick={() => removeItem(item.id)}
                >
                  <FiTrash2 />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-4">خلاصه سفارش</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>جمع سبد خرید</span>
                <span>{new Intl.NumberFormat('fa-IR').format(total)} تومان</span>
              </div>
              <div className="flex justify-between">
                <span>هزینه ارسال</span>
                <span>رایگان</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold">
                  <span>مجموع</span>
                  <span>{new Intl.NumberFormat('fa-IR').format(total)} تومان</span>
                </div>
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
              ادامه فرآیند خرید
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-bold mb-4">سبد خرید شما خالی است</h2>
          <p className="text-gray-600 mb-8">برای مشاهده محصولات به صفحه فروشگاه بروید</p>
          <Link href="/products">
            <a className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              مشاهده محصولات
            </a>
          </Link>
        </div>
      )}
    </div>
  );
}