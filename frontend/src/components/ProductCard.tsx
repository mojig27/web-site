// frontend/src/components/ProductCard.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { FiShoppingCart, FiHeart } from 'react-icons/fi'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'react-hot-toast'

interface ProductCardProps {
  product: {
    id: string
    title: string
    price: number
    image: string
    category: string
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem(product)
    toast.success('محصول به سبد خرید اضافه شد')
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative h-48">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
          />
          <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition">
            <FiHeart className="text-gray-600" />
          </button>
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <div className="text-sm text-blue-600 mb-1">{product.category}</div>
          <h3 className="font-medium mb-2 hover:text-blue-600 transition">
            {product.title}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">
            {new Intl.NumberFormat('fa-IR').format(product.price)} تومان
          </span>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FiShoppingCart />
            خرید
          </button>
        </div>
      </div>
    </motion.div>
  )
}