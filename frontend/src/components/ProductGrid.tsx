// frontend/src/components/ProductGrid.tsx
'use client'

import { motion } from 'framer-motion'
import ProductCard from './ProductCard'

// این داده‌ها باید از API گرفته شوند
const products = [
  {
    id: '1',
    title: 'گوشی هوشمند سامسونگ',
    price: 12500000,
    image: '/images/products/phone.jpg',
    category: 'موبایل'
  },
  {
    id: '2',
    title: 'لپ تاپ ایسوس',
    price: 45000000,
    image: '/images/products/laptop.jpg',
    category: 'لپ تاپ'
  },
  // بقیه محصولات...
]

export default function ProductGrid() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">محصولات پرفروش</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}