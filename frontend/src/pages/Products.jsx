// frontend/src/pages/Products.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/features/products/ProductCard';

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.products);
  const [filters, setFilters] = useState({
    category: '',
    sort: '',
    page: 1
  });

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      page: 1 // بازنشانی صفحه هنگام تغییر فیلترها
    });
  };

  if (loading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>خطا: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* فیلترها */}
      <div className="mb-8 flex gap-4">
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">همه دسته‌بندی‌ها</option>
          <option value="electronics">الکترونیک</option>
          <option value="clothing">پوشاک</option>
          {/* سایر دسته‌بندی‌ها */}
        </select>

        <select
          name="sort"
          value={filters.sort}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">مرتب‌سازی</option>
          <option value="price_asc">قیمت: کم به زیاد</option>
          <option value="price_desc">قیمت: زیاد به کم</option>
        </select>
      </div>

      {/* لیست محصولات */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;