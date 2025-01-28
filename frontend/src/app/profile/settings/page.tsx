// frontend/src/app/profile/settings/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useUserStore } from '@/store/userStore'
import { toast } from 'react-hot-toast'
import { FiLock, FiBell, FiUser, FiEye, FiEyeOff } from 'react-icons/fi'

interface SecuritySettings {
  enableTwoFactor: boolean
  emailNotifications: boolean
  loginAlerts: boolean
}

interface NotificationSettings {
  orderUpdates: boolean
  promotions: boolean
  priceAlerts: boolean
  newsletter: boolean
}

interface PreferenceSettings {
  language: string
  theme: 'light' | 'dark' | 'system'
  currency: string
}

export default function SettingsPage() {
  const { user } = useUserStore()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [activeTab, setActiveTab] = useState<'security' | 'notifications' | 'preferences'>('security')
  
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    enableTwoFactor: false,
    emailNotifications: true,
    loginAlerts: true,
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    orderUpdates: true,
    promotions: true,
    priceAlerts: false,
    newsletter: true,
  })

  const [preferenceSettings, setPreferenceSettings] = useState<PreferenceSettings>({
    language: 'fa',
    theme: 'light',
    currency: 'IRT',
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('رمز عبور جدید و تکرار آن مطابقت ندارند')
      return
    }

    try {
      // در اینجا باید به API درخواست ارسال شود
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('رمز عبور با موفقیت تغییر کرد')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      toast.error('خطا در تغییر رمز عبور')
    }
  }

  const handleSettingChange = async (
    type: 'security' | 'notifications' | 'preferences',
    key: string,
    value: any
  ) => {
    try {
      // در اینجا باید به API درخواست ارسال شود
      await new Promise(resolve => setTimeout(resolve, 500))

      switch (type) {
        case 'security':
          setSecuritySettings(prev => ({ ...prev, [key]: value }))
          break
        case 'notifications':
          setNotificationSettings(prev => ({ ...prev, [key]: value }))
          break
        case 'preferences':
          setPreferenceSettings(prev => ({ ...prev, [key]: value }))
          break
      }

      toast.success('تنظیمات با موفقیت ذخیره شد')
    } catch (error) {
      toast.error('خطا در ذخیره تنظیمات')
    }
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-1">
        <div className="flex space-x-1 space-x-reverse">
          {[
            { id: 'security', icon: FiLock, label: 'امنیت' },
            { id: 'notifications', icon: FiBell, label: 'اعلان‌ها' },
            { id: 'preferences', icon: FiUser, label: 'ترجیحات' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition
                ${activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-6">تنظیمات امنیتی</h2>

            {/* Password Change Form */}
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">رمز عبور فعلی</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full p-2 border rounded-md pl-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">رمز عبور جدید</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full p-2 border rounded-md pl-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showNewPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">تکرار رمز عبور جدید</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                تغییر رمز عبور
              </button>
            </form>

            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">احراز هویت دو مرحله‌ای</div>
                  <div className="text-sm text-gray-600">افزایش امنیت حساب کاربری</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securitySettings.enableTwoFactor}
                    onChange={(e) => handleSettingChange('security', 'enableTwoFactor', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">اعلان‌های ورود</div>
                  <div className="text-sm text-gray-600">دریافت ایمیل هنگام ورود به حساب</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securitySettings.loginAlerts}
                    onChange={(e) => handleSettingChange('security', 'loginAlerts', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-6">تنظیمات اعلان‌ها</h2>
            
            <div className="space-y-4">
              {[
                { key: 'orderUpdates', label: 'به‌روزرسانی سفارش‌ها', desc: 'دریافت اعلان برای تغییر وضعیت سفارش‌ها' },
                { key: 'promotions', label: 'تخفیف‌ها و پیشنهادات', desc: 'اطلاع از تخفیف‌های ویژه و پیشنهادات' },
                { key: 'priceAlerts', label: 'هشدار قیمت', desc: 'اطلاع از تغییر قیمت کالاهای مورد علاقه' },
                { key: 'newsletter', label: 'خبرنامه', desc: 'دریافت آخرین اخبار و بروزرسانی‌ها' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm text-gray-600">{item.desc}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings[item.key as keyof NotificationSettings]}
                      onChange={(e) => handleSettingChange('notifications', item.key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preferences Settings */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-6">تنظیمات ترجیحات</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">زبان</label>
                <select
                  value={preferenceSettings.language}
                  onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="fa">فارسی</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">تم</label>
                <select
                  value={preferenceSettings.theme}
                  onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="light">روشن</option>
                  <option value="dark">تاریک</option>
                  <option value="system">سیستم</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">واحد پول</label>
                <select
                  value={preferenceSettings.currency}
                  onChange={(e) => handleSettingChange('preferences', 'currency', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="IRT">تومان</option>
                  <option value="USD">دلار</option>
                  <option value="EUR">یورو</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}