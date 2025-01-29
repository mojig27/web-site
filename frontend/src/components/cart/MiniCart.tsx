// frontend/src/components/cart/MiniCart.tsx
import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/utils/format';

export const MiniCart: React.FC = () => {
  const { items, itemCount, total } = useCartStore();

  if (itemCount === 0) {
    return (
      <div className="p-4 text-center">
        <p>سبد خرید شما خالی است</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="space-y-4">
        {items.slice(0, 3).map((item) => (
          <div key={item._id} className="flex gap-4">
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h3 className="text-sm font-medium">{item.title}</h3>
              <p className="text-sm text-gray-500">
                {item.quantity} × {formatPrice(item.price)}
              </p>
            </div>
          </div>
        ))}
        {items.length > 3 && (
          <p className="text-sm text-gray-500 text-center">
            و {items.length - 3} محصول دیگر
          </p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between mb-4">
          <span>جمع کل:</span>
          <span className="font-bold">{formatPrice(total)}</span>
        </div>
        <Link
          href="/cart"
          className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          مشاهده سبد خرید
        </Link>
      </div>
    </div>
  );
};