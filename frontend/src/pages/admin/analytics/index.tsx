// frontend/src/pages/admin/analytics/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { DashboardStats } from '@/components/admin/analytics/DashboardStats';
import { ReportBuilder } from '@/components/admin/analytics/ReportBuilder';
import { analyticsService } from '@/services/analytics.service';

export default function AdminAnalytics() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date()
  });
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    metrics: {},
    reports: [],
    charts: {},
    trends: {}
  });
  const [filters, setFilters] = useState({
    metric: 'all',
    category: 'all',
    groupBy: 'day'
  });

  const tabs = [
    { id: 'dashboard', label: 'داشبورد' },
    { id: 'reports', label: 'گزارش‌ساز' },
    { id: 'metrics', label: 'معیارها' },
    { id: 'exports', label: 'خروجی‌ها' }
  ];

  const metricCategories = {
    sales: 'فروش',
    users: 'کاربران',
    products: 'محصولات',
    orders: 'سفارشات',
    inventory: 'موجودی',
    financial: 'مالی'
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [activeTab, dateRange, filters]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await analyticsService.getData({
        tab: activeTab,
        dateRange,
        filters
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">مدیریت آمار و گزارش‌گیری</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={dateRange.start.toISOString().split('T')[0]}
                  onChange={(e) => setDateRange({ ...dateRange, start: new Date(e.target.value) })}
                  className="border rounded-lg p-2"
                />
                <span>تا</span>
                <input
                  type="date"
                  value={dateRange.end.toISOString().split('T')[0]}
                  onChange={(e) => setDateRange({ ...dateRange, end: new Date(e.target.value) })}
                  className="border rounded-lg p-2"
                />
              </div>
              <button
                onClick={() => {
                  // Export current view as PDF/Excel
                  analyticsService.exportData(activeTab, dateRange, filters);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                دریافت خروجی
              </button>
            </div>
          </div>
        </div>

        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* فیلترها */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={filters.metric}
                onChange={(e) => setFilters({ ...filters, metric: e.target.value })}
                className="border rounded-lg p-2"
              >
                <option value="all">همه معیارها</option>
                {Object.entries(metricCategories).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <select
                value={filters.groupBy}
                onChange={(e) => setFilters({ ...filters, groupBy: e.target.value })}
                className="border rounded-lg p-2"
              >
                <option value="hour">ساعتی</option>
                <option value="day">روزانه</option>
                <option value="week">هفتگی</option>
                <option value="month">ماهانه</option>
                <option value="quarter">فصلی</option>
                <option value="year">سالانه</option>
              </select>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="border rounded-lg p-2"
              >
                <option value="all">همه دسته‌ها</option>
                <option value="products">محصولات</option>
                <option value="customers">مشتریان</option>
                <option value="orders">سفارشات</option>
                <option value="marketing">بازاریابی</option>
              </select>
            </div>
          </div>

          {activeTab === 'dashboard' && (
            <DashboardStats
              metrics={data.metrics}
              charts={data.charts}
              trends={data.trends}
              loading={loading}
              dateRange={dateRange}
              onMetricClick={(metric) => {
                setActiveTab('reports');
                setFilters({ ...filters, metric });
              }}
            />
          )}

          {activeTab === 'reports' && (
            <ReportBuilder
              data={data}
              dateRange={dateRange}
              filters={filters}
              onSaveReport={async (reportConfig) => {
                await analyticsService.saveReport(reportConfig);
                await fetchAnalyticsData();
              }}
              onScheduleReport={async (reportId, schedule) => {
                await analyticsService.scheduleReport(reportId, schedule);
                await fetchAnalyticsData();
              }}
            />
          )}

          {activeTab === 'metrics' && (
            <MetricManager
              metrics={data.metrics}
              onCreateMetric={async (metricData) => {
                await analyticsService.createMetric(metricData);
                await fetchAnalyticsData();
              }}
              onUpdateMetric={async (metricId, updates) => {
                await analyticsService.updateMetric(metricId, updates);
                await fetchAnalyticsData();
              }}
            />
          )}

          {activeTab === 'exports' && (
            <ExportManager
              exports={data.exports}
              onExport={async (exportConfig) => {
                await analyticsService.exportData(exportConfig);
              }}
              onScheduleExport={async (exportId, schedule) => {
                await analyticsService.scheduleExport(exportId, schedule);
                await fetchAnalyticsData();
              }}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}