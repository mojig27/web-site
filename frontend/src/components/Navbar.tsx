// frontend/src/components/Navbar.tsx
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <span className="text-2xl font-bold text-blue-600">فروشگاه</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link href="/products">
              <span className="text-gray-700 hover:text-blue-600 transition">محصولات</span>
            </Link>
            <Link href="/categories">
              <span className="text-gray-700 hover:text-blue-600 transition">دسته‌بندی‌ها</span>
            </Link>
            <Link href="/about">
              <span className="text-gray-700 hover:text-blue-600 transition">درباره ما</span>
            </Link>
            <Link href="/contact">
              <span className="text-gray-700 hover:text-blue-600 transition">تماس با ما</span>
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <motion.div
              className="relative cursor-pointer"
              whileHover={{ scale: 1.1 }}
            >
              <FiShoppingCart className="text-2xl text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </motion.div>
            <motion.div
              className="cursor-pointer"
              whileHover={{ scale: 1.1 }}
            >
              <FiUser className="text-2xl text-gray-700" />
            </motion.div>
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <FiX className="text-2xl text-gray-700" />
              ) : (
                <FiMenu className="text-2xl text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link href="/products">
                <span className="block text-gray-700 hover:text-blue-600 transition">محصولات</span>
              </Link>
              <Link href="/categories">
                <span className="block text-gray-700 hover:text-blue-600 transition">دسته‌بندی‌ها</span>
              </Link>
              <Link href="/about">
                <span className="block text-gray-700 hover:text-blue-600 transition">درباره ما</span>
              </Link>
              <Link href="/contact">
                <span className="block text-gray-700 hover:text-blue-600 transition">تماس با ما</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}