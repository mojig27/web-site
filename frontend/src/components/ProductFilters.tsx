// frontend/src/components/ProductFilters.tsx
'use client'

import { motion } from 'framer-motion'
import { FiX } from 'react-icons/fi'

interface FilterState {
  categories: string[]
  brands: string[]
  priceRange: [number, number]
  inStock: boolean
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'popular'
}

interface FiltersProps {
  filters: FilterState
  categories: string[]
  brands: string[]
  onFilterChange: (newFilters: FilterState) => void
  onClose: () => void
  isMobile: boolean
}

export default function ProductFilters({
  filters,
  categories,
  brands,
  onFilterChange,
  onClose,
  isMobile
}: FiltersProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price)
  }

  const handlePriceRangeChange = (index: 0 | 1, value: number) => {
    const newRange = [...filters.priceRange] as [number, number]
    newRange[index] = value
    
    // اطمینان از اینکه حداقل قیمت از حداکثر بیشتر نشود
    if (index === 0 && value > filters.priceRange[1]) {
      newRange[1] = value
    } else if (index === 1 && value < filters.priceRange[0]) {
      newRange[0] = value
    }

    onFilterChange({ ...filters, priceRange: newRange })
  }

  return (
    <motion.div
      initial={isMobile ? { x: -300 } : false}
      animate={{ x: 0 }}
      exit={isMobile ? { x: -300 } : undefined}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">فیلترها</h2>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            aria-label="بستن"
          >
            <FiX className="text-xl" />
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">دسته‌بندی‌ها</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
          {categories.map(category => (
            <label key={category} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={(e) => {
                  const newCategories = e.target.checked
                    ? [...filters.categories, category]
                    : filters.categories.filter(c => c !== category)
                  onFilterChange({ ...filters, categories: newCategories })
                }}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="mr-2 text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">برندها</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
          {brands.map(brand => (
            <label key={brand} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={(e) => {
                  const newBrands = e.target.checked
                    ? [...filters.brands, brand]
                    : filters.brands.filter(b => b !== brand)
                  onFilterChange({ ...filters, brands: newBrands })
                }}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="mr-2 text-sm">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">محدوده قیمت</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">از</label>
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceRangeChange(0, Number(e.target.value))}
                className="w-full p-2 border rounded-md text-sm"
                min="0"
                step="100000"
              />
              <span className="text-xs text-gray-500 mt-1 block">
                {formatPrice(filters.priceRange[0])} تومان
              </span>
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">تا</label>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceRangeChange(1, Number(e.target.value))}
                className="w-full p-2 border rounded-md text-sm"
                min={filters.priceRange[0]}
                step="100000"
              />
              <span className="text-xs text-gray-500 mt-1 block">
                {formatPrice(filters.priceRange[1])} تومان
              </span>
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="relative pt-1">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="absolute h-2 bg-blue-600 rounded-full"
                style={{
                  width: `${((filters.priceRange[1] - filters.priceRange[0]) / 100000000) * 100}%`,
                  left: `${(filters.priceRange[0] / 100000000) * 100}%`
                }}
              />
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100000000"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceRangeChange(0, Number(e.target.value))}
                className="absolute w-full -top-1 h-2 appearance-none bg-transparent pointer-events-none"
              />
              <input
                type="range"
                min="0"
                max="100000000"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceRangeChange(1, Number(e.target.value))}
                className="absolute w-full -top-1 h-2 appearance-none bg-transparent pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stock Status */}
      <div className="mb-6">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => onFilterChange({
              ...filters,
              inStock: e.target.checked
            })}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="mr-2 text-sm">فقط کالاهای موجود</span>
        </label>
      </div>

      {/* Sort By (Mobile Only) */}
      {isMobile && (
        <div className="mb-6">
          <h3 className="font-medium mb-3">مرتب‌سازی</h3>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({
              ...filters,
              sortBy: e.target.value as FilterState['sortBy']
            })}
            className="w-full p-2 border rounded-md"
          >
            <option value="newest">جدیدترین</option>
            <option value="price-asc">ارزان‌ترین</option>
            <option value="price-desc">گران‌ترین</option>
            <option value="popular">محبوب‌ترین</option>
          </select>
        </div>
      )}

      {/* Reset Filters */}
      <button
        onClick={() => onFilterChange({
          categories: [],
          brands: [],
          priceRange: [0, 100000000],
          inStock: false,
          sortBy: 'newest'
        })}
        className="w-full bg-gray-100 text-gray-600 py-2 rounded-lg hover:bg-gray-200 transition text-sm"
      >
        حذف همه فیلترها
      </button>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #666;
        }

        /* Range Slider Styles */
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          height: 2px;
          background: transparent;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          pointer-events: auto;
          margin-top: -7px;
        }
        input[type="range"]::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          pointer-events: auto;
        }
      `}</style>
    </motion.div>
  )
}