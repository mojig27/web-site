// frontend/src/components/product/ProductFilters.tsx
import React from 'react';
import { ProductCategories } from '@/constants/categories';

interface ProductFiltersProps {
  filters: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    material?: string;
    inStock?: boolean;
  };
  onFilterChange: (filters: any) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">فیلترها</h3>
      
      {/* دسته‌بندی */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">دسته‌بندی</label>
        <select
          className="w-full p-2 border rounded"
          value={filters.category}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
        >
          <option value="">همه</option>
          {Object.entries(ProductCategories).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>

      {/* محدوده قیمت */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">محدوده قیمت</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="حداقل"
            className="w-1/2 p-2 border rounded"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value })}
          />
          <input
            type="number"
            placeholder="حداکثر"
            className="w-1/2 p-2 border rounded"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value })}
          />
        </div>
      </div>

      {/* فقط کالاهای موجود */}
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="ml-2"
            checked={filters.inStock}
            onChange={(e) => onFilterChange({ ...filters, inStock: e.target.checked })}
          />
          <span className="text-sm">فقط کالاهای موجود</span>
        </label>
      </div>
    </div>
  );
};