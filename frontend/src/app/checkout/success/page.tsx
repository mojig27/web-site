// frontend/src/app/checkout/success/page.tsx
'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiCheck, FiArrowLeft } from 'react-icons/fi'

export default function CheckoutSuccessPage() {
  useEffect(() => {
    // اینجا می‌توانید تحلیل‌های خود را اضافه کنید
  }, [])

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
        >
          <FiCheck className="text-4xl text-green-600" />
        </motion.div>
        <h1 className="text-2xl font-bold mb-4">سفارش شما با موفقیت ثبت شد</h1>
        <p className="text-gray-600 mb-8">
          از خرید شما متشکریم. جزئیات سفارش به ایمیل شما ارسال خواهد شد.
        </p>
        <div className="space-y-4">
          <Link
            href="/profile/orders"
            className="block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            پیگیری سفارش
          </Link>
          <Link
            href="/products"
            className="block w-full border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2"
          >
            <FiArrowLeft />
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    </div>
  )
}