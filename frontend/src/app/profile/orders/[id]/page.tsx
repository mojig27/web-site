// frontend/src/app/profile/orders/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FiArrowRight, FiClock, FiPackage, FiTruck, FiCheck, FiMapPin } from 'react-icons/fi'

interface OrderDetails {
  id: string
  date: string
  status: 'pending' | 'processing' | 'shipping' | 'delivered' | 'cancelled'
  items: Array<{
    id: string
    title: string
    price: number
    quantity: number
    image: string
  }>
  totalPrice: number
  trackingCode?: string
  shipping: {
    address: string
    city: string
    postalCode: string
    phone: string
    recipient: string
  }
  payment: {
    method: string
    status: string
    transactionId?: string
  }
}

const statusSteps = [
  { icon: FiClock, label: 'ثبت سفارش', status: 'pending' },
  { icon: FiPackage, label: 'پردازش سفارش', status: 'processing' },
  { icon: FiTruck, label: 'ارسال سفارش', status: 'shipping' },
  { icon: FiCheck, label: 'تحویل سفارش', status: 'delivered' }
]

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // در پروژه واقعی از API دریافت می‌شود
    const fetchOrder = async () => {
      try {
        // شبیه‌سازی دریافت داده
        await new Promise(resolve => setTimeout(resolve, 1000))
        setOrder({
          id: params.id,
          date: '۱۴۰۲/۱۱/۰۸',
          status: 'shipping',
          trackingCode: '123456789',
          items: [
            {
              id: '1',
              title: 'گوشی هوشمند سامسونگ',
              price: 12500000,
              quantity: 1,
              image: '/images/products/phone.jpg'
            },
            {
              id: '2',
              title: 'کیف محافظ گوشی',
              price: 500000,
              quantity: 2,
              image: '/images/products/case.jpg'
            }
          ],
          totalPrice: 13500000,
          shipping: {
            recipient: 'علی محمدی',
            address: 'خیابان ولیعصر، کوچه بهار، پلاک ۱۲',
            city: 'تهران',
            postalCode: '1234567890',
            phone: '09123456789'
          },
          payment: {
            method: 'پرداخت آنلاین',
            status: 'پرداخت شده',
            transactionId: 'TRX-123456'
          }
        })
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">سفارش مورد نظر یافت نشد</p>
        <Link
          href="/profile/orders"
          className="mt-4 inline-block text-blue-600 hover:text-blue-700"
        >
          بازگشت به لیست سفارش‌ها
        </Link>
      </div>
    )
  }

  const currentStepIndex = statusSteps.findIndex(step => step.status === order.status)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <FiArrowRight className="text-xl" />
        </button>
        <div>
          <h1 className="text-xl font-bold">جزئیات سفارش #{order.id}</h1>
          <p className="text-gray-600 text-sm">{order.date}</p>
        </div>
      </div>

      {/* Order Status */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="font-bold mb-6">وضعیت سفارش</h2>
        <div className="relative flex justify-between">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`
              }}
            />
          </div>

          {/* Status Steps */}
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentStepIndex
            const isCurrent = index === currentStepIndex

            return (
              <div
                key={step.status}
                className="relative flex flex-col items-center"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                    isCompleted
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  } ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}
                >
                  <step.icon className="text-xl" />
                </div>
                <span
                  className={`mt-2 text-sm ${
                    isCompleted ? 'text-blue-600 font-medium' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>

        {order.trackingCode && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="font-medium text-blue-600">کد رهگیری پستی:</div>
            <div className="text-gray-600">{order.trackingCode}</div>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="font-bold mb-6">اقلام سفارش</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 border rounded-lg"
            >
              <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium">{item.title}</h3>
                <div className="text-sm text-gray-600">
                  {item.quantity} عدد × {new Intl.NumberFormat('fa-IR').format(item.price)} تومان
                </div>
              </div>
              <div className="text-left font-medium">
                {new Intl.NumberFormat('fa-IR').format(item.price * item.quantity)} تومان
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between font-bold">
            <span>جمع کل</span>
            <span>{new Intl.NumberFormat('fa-IR').format(order.totalPrice)} تومان</span>
          </div>
        </div>
      </div>

      {/* Shipping & Payment Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="font-bold mb-6 flex items-center gap-2">
            <FiMapPin />
            اطلاعات ارسال
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>گیرنده: {order.shipping.recipient}</p>
            <p>شماره تماس: {order.shipping.phone}</p>
            <p>آدرس: {order.shipping.city}، {order.shipping.address}</p>
            <p>کد پستی: {order.shipping.postalCode}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="font-bold mb-6 flex items-center gap-2">
            <FiClock />
            اطلاعات پرداخت
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>روش پرداخت: {order.payment.method}</p>
            <p>وضعیت پرداخت: {order.payment.status}</p>
            {order.payment.transactionId && (
              <p>شماره تراکنش: {order.payment.transactionId}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}