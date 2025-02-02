// frontend/src/components/products/ProductCard.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/utils/format';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${product._id}`}>
        <div className="relative h-48 mb-4">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover rounded-t-lg"
          />
          {product.discount?.percentage > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md">
              {product.discount.percentage}% تخفیف
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">{product.title}</h3>
          <div className="flex justify-between items-center">
            <div>
              {product.discount?.percentage > 0 ? (
                <>
                  <span className="text-gray-400 line-through text-sm">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-lg font-bold text-red-500 mr-2">
                    {formatPrice(product.price * (1 - product.discount.percentage / 100))}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <div className={`px-2 py-1 rounded ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {product.stock > 0 ? 'موجود' : 'ناموجود'}
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <span className="ml-2">برند: {product.brand}</span>
            {product.warranty && (
              <span>گارانتی: {product.warranty.months} ماه</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

// frontend/src/components/products/ProductGrid.tsx
import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

// frontend/src/components/products/ProductFilters.tsx
import React, { useState } from 'react';
import { ProductFilters } from '@/types';

interface ProductFiltersProps {
  onFilter: (filters: ProductFilters) => void;
  categories: string[];
  brands: string[];
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  onFilter,
  categories,
  brands,
}) => {
  const [filters, setFilters] = useState<ProductFilters>({});

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFilters(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            دسته‌بندی
          </label>
          <select
            name="category"
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          >
            <option value="">همه</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            برند
          </label>
          <select
            name="brand"
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          >
            <option value="">همه</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            محدوده قیمت
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              name="minPrice"
              placeholder="حداقل"
              onChange={handleChange}
              className="w-1/2 border rounded-md p-2"
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="حداکثر"
              onChange={handleChange}
              className="w-1/2 border rounded-md p-2"
            />
          </div>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            اعمال فیلتر
          </button>
        </div>
      </div>
    </form>
  );
};