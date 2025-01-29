// frontend/src/pages/products/index.tsx
import { useState, useEffect } from 'react';
import { ProductList } from '@/components/product/ProductList';
import { ProductFilters } from '@/components/product/ProductFilters';
import { useProducts } from '@/hooks/useProducts';

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
  });

  const { products, loading, error } = useProducts(filters);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">محصولات</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <ProductFilters
            filters={filters}
            onFilterChange={setFilters}
          />
        </div>
        
        <div className="w-full md:w-3/4">
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <ProductList
              products={products}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}