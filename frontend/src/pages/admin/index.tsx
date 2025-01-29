// frontend/src/pages/admin/index.tsx
import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { requireAuth } from '@/utils/auth';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  lowStock: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    lowStock: 0,
    revenue: 0
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">پنل مدیریت</h1>

      {/* آمار کلی */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 mb-2">کل محصولات</h3>
          <p className="text-2xl font-bold">{stats.totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 mb-2">سفارشات</h3>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 mb-2">موجودی کم</h3>
          <p className="text-2xl font-bold text-red-500">{stats.lowStock}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 mb-2">درآمد کل</h3>
          <p className="text-2xl font-bold text-green-500">
            {stats.revenue.toLocaleString()} تومان
          </p>
        </div>
      </div>

      {/* دسترسی سریع */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/products">
          <div className="bg-blue-50 p-6 rounded-lg hover:bg-blue-100 transition-colors">
            <h3 className="font-bold mb-2">مدیریت محصولات</h3>
            <p className="text-gray-600">
              افزودن، ویرایش و مدیریت محصولات
            </p>
          </div>
        </Link>
        <Link href="/admin/orders">
          <div className="bg-green-50 p-6 rounded-lg hover:bg-green-100 transition-colors">
            <h3 className="font-bold mb-2">سفارشات</h3>
            <p className="text-gray-600">
              مدیریت و پیگیری سفارشات
            </p>
          </div>
        </Link>
        <Link href="/admin/inventory">
          <div className="bg-yellow-50 p-6 rounded-lg hover:bg-yellow-100 transition-colors">
            <h3 className="font-bold mb-2">موجودی و قیمت‌ها</h3>
            <p className="text-gray-600">
              مدیریت موجودی و قیمت‌گذاری
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuth;