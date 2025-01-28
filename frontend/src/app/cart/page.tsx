// frontend/src/app/cart/page.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore()

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(id, newQuantity)
  }

  const handleRemoveItem = (id: string) => {
    removeItem(id)
    toast.success('محصول از سبد خرید حذف شد')
  }

  const handleClearCart = () => {
    clearCart()
    toast.success('سبد خرید خالی شد')
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('سبد خرید شما خالی است')
      return
    }
    router.push('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">سبد خرید شما خالی است</h1>
          <p className="text-gray-600 mb-8">
            برای مشاهده محصولات به صفحه فروشگاه مراجعه کنید
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <FiArrowLeft />
            مشاهده محصولات
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">سبد خرید</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm"
              >
                <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{item.title}</h3>
                  <div className="text-blue-600 mt-1">
                    {new Intl.NumberFormat('fa-IR').format(item.price)} تومان
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="p-1 hover:bg-gray-100 rounded transition"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  >
                    <FiMinus />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    className="p-1 hover:bg-gray-100 rounded transition"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    <FiPlus />
                  </button>
                </div>
                <div className="text-left font-medium">
                  {new Intl.NumberFormat('fa-IR').format(item.price * item.quantity)} تومان
                </div>
                <button
                  className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <FiTrash2 />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={handleClearCart}
            className="text-red-500 hover:text-red-600 transition flex items-center gap-2"
          >
            <FiTrash2 />
            پاک کردن سبد خرید
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
          <h2 className="text-xl font-bold mb-4">خلاصه سفارش</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span>تعداد اقلام</span>
              <span>{items.length} عدد</span>
            </div>
            <div className="flex justify-between">
              <span>هزینه ارسال</span>
              <span className="text-green-600">رایگان</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between font-bold">
                <span>مجموع</span>
                <span>{new Intl.NumberFormat('fa-IR').format(totalPrice())} تومان</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            ادامه فرآیند خرید
          </button>

          <Link
            href="/products"
            className="w-full mt-4 border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2"
          >
            <FiArrowLeft />
            ادامه خرید
          </Link>
        </div>
      </div>
    </div>
  )
}