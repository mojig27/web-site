// frontend/src/app/profile/favorites/page.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'react-hot-toast'
import '@/styles/print.css';
// ابتدا یک store جدید برای علاقه‌مندی‌ها ایجاد می‌کنیم
// frontend/src/store/favoriteStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoriteItem {
  id: string
  title: string
  price: number
  image: string
  category: string
  inStock: boolean
}

interface FavoriteStore {
  items: FavoriteItem[]
  addItem: (item: FavoriteItem) => void
  removeItem: (id: string) => void
  clearAll: () => void
}

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => 
        set((state) => ({
          items: state.items.some((i) => i.id === item.id)
            ? state.items
            : [...state.items, item],
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clearAll: () => set({ items: [] }),
    }),
    {
      name: 'favorites-storage',
    }
  )
)

// حالا صفحه اصلی علاقه‌مندی‌ها را می‌سازیم
export default function FavoritesPage() {
  const { items, removeItem } = useFavoriteStore()
  const addToCart = useCartStore((state) => state.addItem)
  const [isGridView, setIsGridView] = useState(true)

  const handleAddToCart = (item: FavoriteItem) => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
    })
    toast.success('محصول به سبد خرید اضافه شد')
  }

  const handleRemoveFromFavorites = (id: string) => {
    removeItem(id)
    toast.success('محصول از علاقه‌مندی‌ها حذف شد')
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">علاقه‌مندی‌های من</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGridView(!isGridView)}
              className="text-gray-600 hover:text-blue-600 transition"
            >
              {isGridView ? 'نمایش لیستی' : 'نمایش شبکه‌ای'}
            </button>
            {items.length > 0 && (
              <button
                onClick={() => {
                  useFavoriteStore.getState().clearAll()
                  toast.success('همه موارد حذف شدند')
                }}
                className="text-red-500 hover:text-red-600 transition"
              >
                حذف همه
              </button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <FiHeart className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">لیست علاقه‌مندی‌های شما خالی است</p>
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <AnimatePresence>
            <div className={isGridView ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`bg-white rounded-lg border hover:shadow-md transition ${
                    isGridView ? '' : 'flex items-center gap-4 p-4'
                  }`}
                >
                  <div className={`relative ${isGridView ? 'h-48' : 'w-24 h-24'}`}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    <button
                      onClick={() => handleRemoveFromFavorites(item.id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
                    >
                      <FiTrash2 className="text-red-500" />
                    </button>
                  </div>

                  <div className={`p-4 ${isGridView ? '' : 'flex-1'}`}>
                    <Link href={`/products/${item.id}`}>
                      <h3 className="font-medium hover:text-blue-600 transition">
                        {item.title}
                      </h3>
                    </Link>
                    <div className="text-sm text-blue-600 mt-1">{item.category}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold">
                        {new Intl.NumberFormat('fa-IR').format(item.price)} تومان
                      </span>
                      {item.inStock ? (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                          <FiShoppingCart />
                          افزودن به سبد
                        </button>
                      ) : (
                        <span className="text-red-500 text-sm">ناموجود</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}