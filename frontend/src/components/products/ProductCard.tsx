// frontend/src/components/product/ProductCard.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IProduct } from '@/types/product';
import { formatPrice } from '@/utils/format';

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/products/${product._id}`}>
        <div className="relative h-64 w-full">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.discount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full">
              {product.discount.percent}% تخفیف
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">{product.brand}</span>
            <span className="text-gray-600">{product.specifications.material}</span>
          </div>
          {product.discount ? (
            <div className="flex flex-col">
              <span className="line-through text-gray-400">
                {formatPrice(product.price)}
              </span>
              <span className="text-lg font-bold text-red-500">
                {formatPrice(product.price * (1 - product.discount.percent / 100))}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold">{formatPrice(product.price)}</span>
          )}
          <div className="mt-2 flex justify-between items-center">
            <span className={`text-sm ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {product.stock > 0 ? 'موجود' : 'ناموجود'}
            </span>
            {product.installationGuide && (
              <span className="text-sm text-blue-500">
                راهنمای نصب
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};