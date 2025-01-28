// frontend/src/app/products/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { FiFilter, FiX, FiGrid, FiList, FiHeart, FiShoppingCart } from 'react-icons/fi'
import { useCartStore } from '@/store/cartStore'
import { useFavoriteStore } from '@/store/favoriteStore'
import { toast } from 'react-hot-toast'

interface Product {
  id: string
  title: string
  price: number
  image: string
  category: string
  tags: string[]
  brand: string
  rating: number
  inStock: boolean
}

interface FilterState {
  categories: string[]
  brands: string[]
  priceRange: [number, number]
  inStock: boolean
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'popular'
}

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isGridView, setIsGridView] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const addToCart = useCartStore((state) => state.addItem)
  const { addItem: addToFavorites } = useFavoriteStore()
  
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [0, 100000000],
    inStock: false,
    sortBy: 'newest'
  })

  // نمونه داده (در پروژه واقعی از API دریافت می‌شود)
  const categories = ['موبایل', 'لپ تاپ', 'تبلت', 'لوازم جانبی']
  const brands = ['سامسونگ', 'اپل', 'شیائومی', 'هوآوی']

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // در اینجا باید از API داده‌ها دریافت شود
        await new Promise(resolve => setTimeout(resolve, 1000))
        setProducts([
          {
            id: '1',
            title: 'گوشی سامسونگ گلکسی S23 Ultra',
            price: 45000000,
            image: '/images/products/s23-ultra.jpg',
            category: 'موبایل',
            tags: ['5G', 'دوربین حرفه‌ای'],
            brand: 'سامسونگ',
            rating: 4.5,
            inStock: true
          },
          // سایر محصولات...
        ])
      } catch (error) {
        toast.error('خطا در دریافت محصولات')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchParams])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filters.categories.length === 0 || filters.categories.includes(product.category)
    const matchesBrand = filters.brands.length === 0 || filters.brands.includes(product.brand)
    const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    const matchesStock = !filters.inStock || product.inStock

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'popular':
        return b.rating - a.rating
      default:
        return 0
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className={`w-full md:w-64 flex-shrink-0 bg-white rounded-lg shadow-sm p-6 ${
            isFilterOpen ? 'fixed inset-0 z-50 md:relative' : 'hidden md:block'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">فیلترها</h2>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">دسته‌بندی</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={(e) => {
                      const newCategories = e.target.checked
                        ? [...filters.categories, category]
                        : filters.categories.filter(c => c !== category)
                      setFilters(prev => ({ ...prev, categories: newCategories }))
                    }}
                    className="rounded text-blue-600"
                  />
                  <span className="mr-2">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">برند</h3>
            <div className="space-y-2">
              {brands.map(brand => (
                <label key={brand} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={(e) => {
                      const newBrands = e.target.checked
                        ? [...filters.brands, brand]
                        : filters.brands.filter(b => b !== brand)
                      setFilters(prev => ({ ...prev, brands: newBrands }))
                    }}
                    className="rounded text-blue-600"
                  />
                  <span className="mr-2">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">محدوده قیمت</h3>
            <div className="flex gap-4">
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  priceRange: [Number(e.target.value), prev.priceRange[1]]
                }))}
                className="w-full p-2 border rounded-md"
                placeholder="از"
              />
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  priceRange: [prev.priceRange[0], Number(e.target.value)]
                }))}
                className="w-full p-2 border rounded-md"
                placeholder="تا"
              />
            </div>
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                className="rounded text-blue-600"
              />
              <span className="mr-2">فقط کالاهای موجود</span>
            </label>
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => setFilters({
              categories: [],
              brands: [],
              priceRange: [0, 100000000],
              inStock: false,
              sortBy: 'newest'
            })}
            className="w-full bg-gray-100 text-gray-600 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            حذف فیلترها
          </button>
        </motion.div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="md:hidden flex items-center gap-2 text-gray-600"
                >
                  <FiFilter />
                  فیلترها
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsGridView(true)}
                    className={`p-2 rounded ${isGridView ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                  >
                    <FiGrid />
                  </button>
                  <button
                    onClick={() => setIsGridView(false)}
                    className={`p-2 rounded ${!isGridView ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                  >
                    <FiList />
                  </button>
                </div>

                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    sortBy: e.target.value as FilterState['sortBy']
                  }))}
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
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="جستجو در محصولات..."
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Products */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <FiShoppingCart className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">محصولی یافت نشد</p>
            </div>
          ) : (
            <div className={isGridView ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              <AnimatePresence>
                {sortedProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`bg-white rounded-lg shadow-sm overflow-hidden ${
                      isGridView ? '' : 'flex items-center gap-6'
                    }`}
                  >
                    <div className={`relative ${isGridView ? 'h-48' : 'w-48 h-48'}`}>
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => {
                          addToFavorites(product)
                          toast.success('به علاقه‌مندی‌ها اضافه شد')
                        }}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
                      >
                        <FiHeart className="text-gray-600" />
                      </button>
                    </div>

                    <div className="p-4 flex-1">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-medium hover:text-blue-600 transition">
                          {product.title}
                        </h3>
                      </Link>
                      
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-sm text-blue-600">{product.category}</span>
                        <span className="text-sm text-gray-600">•</span>
                        <span className="text-sm text-gray-600">{product.brand}</span>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-bold">
                          {new Intl.NumberFormat('fa-IR').format(product.price)} تومان
                        </span>
                        {product.inStock ? (
                          <button
                            onClick={() => {
                              addToCart(product)
                              toast.success('به سبد خرید اضافه شد')
                            }}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                          >
                            <FiShoppingCart />
                            افزودن به سبد
                          </button>
                        ) : (
                          <span className="text-red-500">ناموجود</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}