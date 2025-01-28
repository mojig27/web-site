// frontend/src/components/Hero.tsx
'use client'

import { motion } from 'framer-motion'
import { FiSearch } from 'react-icons/fi'

export default function Hero() {
  return (
    <section className="relative h-[500px] bg-gradient-to-r from-blue-600 to-purple-600">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-32 text-white"
      >
        <h1 className="text-5xl font-bold mb-6">
          به فروشگاه آنلاین ما خوش آمدید
        </h1>
        <p className="text-xl mb-8 opacity-90">
          بهترین محصولات با بهترین قیمت‌ها
        </p>
        <div className="flex items-center gap-4 max-w-2xl bg-white rounded-lg p-2">
          <FiSearch className="text-gray-500 text-xl ml-2" />
          <input
            type="text"
            placeholder="جستجو در محصولات..."
            className="w-full text-gray-800 outline-none"
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
            جستجو
          </button>
        </div>
      </motion.div>
    </section>
  )
}