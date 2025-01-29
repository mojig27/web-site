// frontend/src/hooks/useProducts.ts
import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';
import { IProduct } from '@/types/product';

interface UseProductsFilters {
  category?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  inStock?: boolean;
}

export const useProducts = (filters: UseProductsFilters) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
        if (filters.inStock) queryParams.append('inStock', 'true');

        const response = await api.get<{ products: IProduct[] }>(`/products?${queryParams}`);
        setProducts(response.data.products);
        setError(null);
      } catch (err) {
        setError('خطا در دریافت محصولات');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  return { products, loading, error };
};