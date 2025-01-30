// src/pages/products/index.tsx
import React, { useState, useEffect } from 'react';
import { Product } from '@/types';

// مشکل: این کد الان وجود نداره و باید اضافه بشه
const ProductsPage = () => {
  // مدیریت state محصولات
  const [products, setProducts] = useState<Product[]>([]);
  // مدیریت state بارگذاری
  const [loading, setLoading] = useState(true);
  // مدیریت state خطا
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('خطا در دریافت محصولات');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError('مشکلی در دریافت محصولات پیش آمده');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>در حال بارگذاری...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">محصولات</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};