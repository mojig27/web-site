// frontend/src/components/ProductsToolbar.tsx
'use client'

import { FiFilter, FiGrid, FiList } from 'react-icons/fi'

interface ToolbarProps {
  isGridView: boolean
  sortBy: string
  searchTerm: string
  onViewChange: (isGrid: boolean) => void
  onSortChange: (sort: string) => void
  onSearchChange: (term: string) => void
  onFilterClick: () => void
}

export default function ProductsToolbar({
  isGridView,
  sortBy,
  searchTerm,
  onViewChange,
  onSortChange,
  onSearchChange,
  onFilterClick
}: ToolbarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onFilterClick}
            className="md:hidden flex items-center gap-2 text-gray-600"
          >
            <FiFilter />
            فیلترها
          </button>

          <div className="flex items-center gap-2 border-r pr-4">
            <button
              onClick={() => onViewChange(true)}
              className={`p-2 rounded ${isGridView ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              aria-label="نمایش شبکه‌ای"
            >
              <FiGrid />
            </button>
            <button
              onClick={() => onViewChange(false)}
              className={`p-2 rounded ${!isGridView ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              aria-label="نمایش لیستی"
            >
              <FiList />
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="newest">جدیدترین</option>
            <option value="price-asc">ارزان‌ترین</option>
            <option value="price-desc">گران‌ترین</option>
            <option value="popular">محبوب‌ترین</option>
          </select>
        </div>

        <div className="flex-1 md:max-w-md">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="جستجو در محصولات..."
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>
    </div>
  )
}