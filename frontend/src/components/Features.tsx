// frontend/src/components/Features.tsx
'use client'

import { motion } from 'framer-motion'
import { FiTruck, FiShield, FiCreditCard, FiHeadphones } from 'react-icons/fi'

const features = [
  {
    icon: FiTruck,
    title: 'ارسال سریع',
    description: 'ارسال رایگان برای خریدهای بالای 500 هزار تومان'
  },
  {
    icon: FiShield,
    title: 'ضمانت اصالت',
    description: 'تضمین اصالت تمامی محصولات'
  },
  {
    icon: FiCreditCard,
    title: 'پرداخت امن',
    description: 'پرداخت امن با درگاه‌های معتبر'
  },
  {
    icon: FiHeadphones,
    title: 'پشتیبانی 24/7',
    description: 'پشتیبانی در تمام ساعات شبانه‌روز'
  }
]

export default function Features() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-xl hover:shadow-lg transition"
            >
              <feature.icon className="text-4xl text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}