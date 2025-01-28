// frontend/src/app/profile/page.tsx
'use client'

import { useState } from 'react'
import { useUserStore } from '@/store/userStore'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function ProfilePage() {
  const { user, setUser } = useUserStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // اینجا باید به API درخواست ارسال شود
      await new Promise(resolve => setTimeout(resolve, 1000)) // شبیه‌سازی API
      setUser({ ...user!, ...formData })
      setIsEditing(false)
      toast.success('اطلاعات با موفقیت به‌روز شد')
    } catch (error) {
      toast.error('خطا در به‌روزرسانی اطلاعات')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">اطلاعات شخصی</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-blue-600 hover:text-blue-700 transition"
        >
          {isEditing ? 'انصراف' : 'ویرایش'}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">نام و نام خانوادگی</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
            ) : (
              <p className="p-2">{formData.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ایمیل</label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
            ) : (
              <p className="p-2">{formData.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">شماره تماس</label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            ) : (
              <p className="p-2">{formData.phone || '---'}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              ذخیره تغییرات
            </button>
          </div>
        )}
      </form>

      {/* Recent Activities */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">فعالیت‌های اخیر</h2>
        <div className="space-y-4">
          {[
            { action: 'ثبت سفارش', date: '۱۴۰۲/۱۱/۰۸', status: 'success' },
            { action: 'به‌روزرسانی پروفایل', date: '۱۴۰۲/۱۱/۰۵', status: 'info' },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                />
                <span>{activity.action}</span>
              </div>
              <span className="text-gray-600 text-sm">{activity.date}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}