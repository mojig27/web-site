// frontend/src/pages/products/index.tsx
import { useEffect, useState } from 'react';
import { ProductGrid, ProductFilters } from '@/components/products';
import { productService } from '@/services/product.service';
import { Product, ProductFilters as Filters } from '@/types';
import { Pagination } from '@/components/common';
import '@/styles/print.css';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({});

  const fetchProducts = async (page: number, filters: Filters = {}) => {
    try {
      setLoading(true);
      const response = await productService.getProducts({
        ...filters,
        page,
        limit: 12
      });
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, filters);
  }, [currentPage, filters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilter = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">محصولات</h1>
      
      <ProductFilters
        onFilter={handleFilter}
        categories={[
          'شیرآلات',
          'سینک',
          'هود',
          'گاز',
          'رادیاتور',
          'آبگرمکن',
          'کولر آبی',
          'کولر گازی',
          'لوله و اتصالات'
        ]}
        brands={[/* لیست برندها */]}
      />

      <ProductGrid products={products} loading={loading} />

      {!loading && totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}