// frontend/src/app/checkout/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { useUserStore } from '@/store/userStore'
import { FiLock, FiCreditCard, FiTruck } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import '@/styles/print.css';

interface ShippingInfo {
  fullName: string
  phone: string
  address: string
  city: string
  postalCode: string
}

interface PaymentMethod {
  id: string
  title: string
  description: string
  icon: JSX.Element
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'online',
    title: 'پرداخت آنلاین',
    description: 'پرداخت با درگاه بانکی',
    icon: <FiCreditCard className="text-2xl" />
  },
  {
    id: 'cod',
    title: 'پرداخت در محل',
    description: 'پرداخت هنگام تحویل',
    icon: <FiTruck className="text-2xl" />
  }
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCartStore()
  const isAuthenticated = useUserStore((state) => state.isAuthenticated())
  
  const [currentStep, setCurrentStep] = useState(1)
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  })
  const [selectedPayment, setSelectedPayment] = useState<string>('online')
  const [isProcessing, setIsProcessing] = useState(false)

  // اگر سبد خرید خالی باشد، به صفحه سبد خرید هدایت می‌شود
  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  // اگر کاربر لاگین نکرده باشد، به صفحه لاگین هدایت می‌شود
  if (!isAuthenticated) {
    router.push('/login?redirect=/checkout')
    return null
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // اعتبارسنجی فرم
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address) {
      toast.error('لطفاً همه فیلدهای ضروری را پر کنید')
      return
    }
    setCurrentStep(2)
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    try {
      // در اینجا باید به API درخواست ارسال شود
      await new Promise(resolve => setTimeout(resolve, 2000)) // شبیه‌سازی API
      
      // پاک کردن سبد خرید و هدایت به صفحه موفقیت
      clearCart()
      router.push('/checkout/success')
    } catch (error) {
      toast.error('خطا در پردازش سفارش')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* مراحل تکمیل سفارش */}
        <div className="flex items-center justify-between mb-8">
          <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2">
              1
            </div>
            <span>اطلاعات ارسال</span>
          </div>
          <div className={`h-px w-16 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
          <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2">
              2
            </div>
            <span>پرداخت</span>
          </div>
        </div>

        {/* فرم اطلاعات ارسال */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h2 className="text-xl font-bold mb-6">اطلاعات ارسال</h2>
            <form onSubmit={handleShippingSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">نام و نام خانوادگی *</label>
                  <input
                    type="text"
                    value={shippingInfo.fullName}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">شماره تماس *</label>
                  <input
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">آدرس کامل *</label>
                  <textarea
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">شهر *</label>
                  <input
                    type="text"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">کد پستی *</label>
                  <input
                    type="text"
                    value={shippingInfo.postalCode}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                ادامه به پرداخت
              </button>
            </form>
          </motion.div>
        )}

        {/* انتخاب روش پرداخت */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-6">انتخاب روش پرداخت</h2>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 border rounded-lg cursor-pointer transition
                      ${selectedPayment === method.id ? 'border-blue-600 bg-blue-50' : 'hover:border-gray-400'}`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-blue-600">{method.icon}</div>
                      <div>
                        <div className="font-medium">{method.title}</div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* خلاصه سفارش */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4">خلاصه سفارش</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>مجموع خرید</span>
                  <span>{new Intl.NumberFormat('fa-IR').format(totalPrice())} تومان</span>
                </div>
                <div className="flex justify-between">
                  <span>هزینه ارسال</span>
                  <span className="text-green-600">رایگان</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold">
                    <span>مبلغ قابل پرداخت</span>
                    <span>{new Intl.NumberFormat('fa-IR').format(totalPrice())} تومان</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    در حال پردازش...
                  </>
                ) : (
                  <>
                    <FiLock />
                    پرداخت و ثبت نهایی سفارش
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}