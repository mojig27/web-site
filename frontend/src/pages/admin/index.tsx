// frontend/src/pages/admin/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { StatCard } from '@/components/admin/dashboard/StatCard';
import { SalesChart } from '@/components/admin/dashboard/SalesChart';
import { ProductsTable } from '@/components/admin/dashboard/ProductsTable';
import { LatestOrders } from '@/components/admin/dashboard/LatestOrders';
import { dashboardService } from '@/services/dashboard.service';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week'); // week, month, year

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getStats(dateRange);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div>در حال بارگذاری...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* کارت‌های آماری */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="فروش امروز"
            value={stats.todaySales.amount}
            type="currency"
            change={stats.todaySales.change}
            icon="money"
          />
          <StatCard
            title="سفارش‌های امروز"
            value={stats.todayOrders.count}
            type="number"
            change={stats.todayOrders.change}
            icon="shopping-cart"
          />
          <StatCard
            title="بازدید امروز"
            value={stats.todayVisits}
            type="number"
            change={stats.visitsChange}
            icon="users"
          />
          <StatCard
            title="میانگین سبد خرید"
            value={stats.averageOrderValue}
            type="currency"
            change={stats.averageOrderChange}
            icon="shopping-bag"
          />
        </div>

        {/* نمودار فروش */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">نمودار فروش</h2>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border rounded-lg p-2"
            >
              <option value="week">هفته اخیر</option>
              <option value="month">ماه اخیر</option>
              <option value="year">سال اخیر</option>
            </select>
          </div>
          <SalesChart data={stats.salesChart} />
        </div>

        {/* آمار محصولات و سفارش‌ها */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">پرفروش‌ترین محصولات</h2>
            <ProductsTable products={stats.topProducts} />
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">آخرین سفارش‌ها</h2>
            <LatestOrders orders={stats.latestOrders} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
