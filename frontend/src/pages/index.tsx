// frontend/src/pages/index.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { FiSearch, FiFilter } from 'react-icons/fi';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
              جستجو
            </button>
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">دسته‌بندی‌ها</h2>
            <button className="flex items-center gap-2 text-gray-600">
              <FiFilter />
              فیلتر
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.05 }}
                className={`p-4 rounded-xl cursor-pointer text-center transition
                  ${selectedCategory === category.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-800 hover:shadow-lg'}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <category.icon className="mx-auto text-2xl mb-2" />
                <p className="font-medium">{category.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">محصولات پرفروش</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-sm"
              >
                <feature.icon className="text-blue-600 text-3xl mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}