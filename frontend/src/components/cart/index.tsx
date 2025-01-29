// frontend/src/pages/cart/index.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/utils/format';

export default function CartPage() {
  const { items, total, removeItem, updateQuantity } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">سبد خرید شما خالی است</h1>
        <p className="text-gray-600 mb-8">
          می‌توانید با مراجعه به فروشگاه، محصولات مورد نظر خود را به سبد خرید اضافه کنید.
        </p>
        <Link
          href="/products"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">سبد خرید</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* لیست محصولات */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 bg-white p-4 rounded-lg shadow"
            >
              <div className="relative w-24 h-24">
                <Image
                  src={item.images[0]}
                  alt={item.title}
                  fill
                  className="object-cover rounded"
                />
              </div>

              <div className="flex-grow">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.brand}</p>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => updateQuantity(item._id, Math.max(0, item.quantity - 1))}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border-x">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    حذف
                  </button>
                </div>
              </div>

              <div className="text-left">
                <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                {item.discount && (
                  <p className="text-sm text-gray-500 line-through">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* خلاصه سفارش */}
        <div className="bg-white p-4 rounded-lg shadow h-fit">
          <h2 className="text-lg font-bold mb-4">خلاصه سفارش</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>تعداد اقلام:</span>
              <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>جمع کل:</span>
              <span className="font-bold">{formatPrice(total)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ادامه فرآیند خرید
          </Link>
        </div>
      </div>
    </div>
  );
}