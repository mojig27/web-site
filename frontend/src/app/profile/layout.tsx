// frontend/src/app/profile/layout.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import Link from 'next/link'
import { FiUser, FiShoppingBag, FiHeart, FiSettings, FiLogOut } from 'react-icons/fi'

const menuItems = [
  { href: '/profile', icon: FiUser, label: 'اطلاعات شخصی' },
  { href: '/profile/orders', icon: FiShoppingBag, label: 'سفارش‌های من' },
  { href: '/profile/favorites', icon: FiHeart, label: 'علاقه‌مندی‌ها' },
  { href: '/profile/settings', icon: FiSettings, label: 'تنظیمات' },
]

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useUserStore()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login?redirect=/profile')
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">
                  {user.name.charAt(0)}
                </span>
              </div>
              <h2 className="font-bold">{user.name}</h2>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <item.icon className="text-gray-600" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 transition"
              >
                <FiLogOut />
                <span>خروج</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {children}
        </div>
      </div>
    </div>
  )
}