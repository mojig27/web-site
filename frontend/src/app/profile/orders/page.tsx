// frontend/src/app/profile/orders/page.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FiChevronDown, FiPackage, FiClock, FiCheck, FiTruck } from 'react-icons/fi'

// تعریف انواع وضعیت سفارش
type OrderStatus = 'pending' | 'processing' | 'shipping' | 'delivered' | 'cancelled'

interface OrderItem {
  id: string
  title: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  date: string
  status: OrderStatus
  items: OrderItem[]
  totalPrice: number
  trackingCode?: string
}

// نمونه داده (در پروژه واقعی از API دریافت می‌شود)
const orders: Order[] = [
  {
    id: '1',
    date: '۱۴۰۲/۱۱/۰۸',
    status: 'delivered',
    trackingCode: '123456789',
    items: [
      {
        id: '1',
        title: 'گوشی هوشمند سامسونگ',
        price: 12500000,
        quantity: 1,
        image: '/images/products/phone.jpg'
      }
    ],
    totalPrice: 12500000
  },
  {
    id: '2',
    date: '۱۴۰۲/۱۱/۱۰',
    status: 'shipping',
    trackingCode: '987654321',
    items: [
      {
        id: '2',
        title: 'لپ تاپ ایسوس',
        price: 45000000,
        quantity: 1,
        image: '/images/products/laptop.jpg'
      }
    ],
    totalPrice: 45000000
  }
]

const statusInfo = {
  pending: { label: 'در انتظار پرداخت', icon: FiClock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  processing: { label: 'در حال پردازش', icon: FiPackage, color: 'text-blue-600', bg: 'bg-blue-100' },
  shipping: { label: 'در حال ارسال', icon: FiTruck, color: 'text-purple-600', bg: 'bg-purple-100' },
  delivered: { label: 'تحویل داده شده', icon: FiCheck, color: 'text-green-600', bg: 'bg-green-100' },
  cancelled: { label: 'لغو شده', icon: FiClock, color: 'text-red-600', bg: 'bg-red-100' }
}

export default function OrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-xl font-bold mb-6">سفارش‌های من</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <FiPackage className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">هنوز سفارشی ثبت نکرده‌اید</p>
            <Link
              href="/products"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg overflow-hidden"
              >
                {/* سربرگ سفارش */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${statusInfo[order.status].bg}`}>
                      <statusInfo[order.status].icon className={`text-xl ${statusInfo[order.status].color}`} />
                    </div>
                    <div>
                      <div className="font-medium">سفارش #{order.id}</div>
                      <div className="text-sm text-gray-600">{order.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <div className="font-medium">
                        {new Intl.NumberFormat('fa-IR').format(order.totalPrice)} تومان
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.items.length} کالا
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedOrder === order.id ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiChevronDown className="text-xl text-gray-400" />
                    </motion.div>
                  </div>
                </div>

                {/* جزئیات سفارش */}
                <AnimatePresence>
                  {expandedOrder === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t"
                    >
                      <div className="p-4 space-y-4">
                        {/* وضعیت سفارش */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="font-medium mb-2">وضعیت سفارش</div>
                          <div className={`text-sm ${statusInfo[order.status].color}`}>
                            {statusInfo[order.status].label}
                          </div>
                          {order.trackingCode && (
                            <div className="text-sm text-gray-600 mt-1">
                              کد رهگیری: {order.trackingCode}
                            </div>
                          )}
                        </div>

                        {/* اقلام سفارش */}
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-4"
                            >
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">
                                  {item.title}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {item.quantity} عدد
                                </div>
                              </div>
                              <div className="text-left">
                                {new Intl.NumberFormat('fa-IR').format(item.price)} تومان
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* دکمه‌های عملیات */}
                        <div className="flex items-center gap-3 pt-4 border-t">
                          <Link
                            href={`/profile/orders/${order.id}`}
                            className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                          >
                            جزئیات کامل سفارش
                          </Link>
                          {order.status === 'delivered' && (
                            <button className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition">
                              ثبت نظر
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}