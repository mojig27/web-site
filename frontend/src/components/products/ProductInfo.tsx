// frontend/src/components/product/ProductInfo.tsx
import React from 'react';
import { IProduct } from '@/types/product';
import { formatPrice } from '@/utils/format';

interface ProductInfoProps {
  product: IProduct;
  onAddToCart: () => void;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product, onAddToCart }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
        <p className="text-gray-600">{product.brand}</p>
      </div>

      {/* قیمت و تخفیف */}
      <div className="border-t border-b py-4">
        {product.discount ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="line-through text-gray-400">
                {formatPrice(product.price)}
              </span>
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                {product.discount.percent}% تخفیف
              </span>
            </div>
            <div className="text-2xl font-bold text-red-500">
              {formatPrice(product.price * (1 - product.discount.percent / 100))}
            </div>
          </div>
        ) : (
          <div className="text-2xl font-bold">
            {formatPrice(product.price)}
          </div>
        )}
      </div>

      {/* مشخصات محصول */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">مشخصات محصول</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex justify-between">
            <span className="text-gray-600">جنس:</span>
            <span>{product.specifications.material}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">ابعاد:</span>
            <span>{product.specifications.dimensions}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">گارانتی:</span>
            <span>{product.specifications.warranty}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">کشور سازنده:</span>
            <span>{product.specifications.madeIn}</span>
          </div>
        </div>
      </div>

      {/* رنگ‌های موجود */}
      <div>
        <h2 className="text-lg font-semibold mb-2">رنگ‌های موجود</h2>
        <div className="flex gap-2">
          {product.specifications.colors.map((color) => (
            <span
              key={color}
              className="px-3 py-1 border rounded-full text-sm"
            >
              {color}
            </span>
          ))}
        </div>
      </div>

      {/* دکمه خرید */}
      <div>
        {product.stock > 0 ? (
          <button
            onClick={onAddToCart}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            افزودن به سبد خرید
          </button>
        ) : (
          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg cursor-not-allowed"
          >
            ناموجود
          </button>
        )}
      </div>

      {/* راهنمای نصب */}
      {product.installationGuide && (
        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">راهنمای نصب</h2>
          <div className="prose prose-sm max-w-none">
            {product.installationGuide}
          </div>
        </div>
      )}
    </div>
  );
};