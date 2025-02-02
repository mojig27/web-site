// frontend/src/pages/admin/financial/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { FinancialDashboard } from '@/components/admin/financial/FinancialDashboard';
import { TransactionList } from '@/components/admin/financial/TransactionList';
import { ReportGenerator } from '@/components/admin/financial/ReportGenerator';
import { financialService } from '@/services/financial.service';
import { DateRangePicker } from '@/components/common/DateRangePicker';

export default function AdminFinancial() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState({
    from: new Date('2025-01-02'),
    to: new Date('2025-02-02')
  });
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    minAmount: '',
    maxAmount: '',
    search: ''
  });

  const tabs = [
    { id: 'dashboard', label: 'داشبورد مالی' },
    { id: 'transactions', label: 'تراکنش‌ها' },
    { id: 'reports', label: 'گزارشات' },
    { id: 'projections', label: 'پیش‌بینی‌ها' }
  ];

  useEffect(() => {
    fetchFinancialData();
  }, [activeTab, dateRange, filters]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const response = await financialService.getFinancialData({
        view: activeTab,
        dateRange,
        filters
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">گزارش‌های مالی</h1>
            <div className="flex items-center gap-4">
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                presets={[
                  { label: 'امروز', days: 0 },
                  { label: 'هفته جاری', days: 7 },
                  { label: 'ماه جاری', days: 30 },
                  { label: 'سه ماه اخیر', days: 90 },
                  { label: 'سال مالی جاری', days: 365 }
                ]}
              />
              <button 
                onClick={() => setActiveTab('reports')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                دانلود گزارش
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
          {activeTab === 'dashboard' && (
            <FinancialDashboard
              data={data}
              dateRange={dateRange}
              loading={loading}
            />
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-6">
              {/* فیلترهای تراکنش */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <input
                  type="text"
                  placeholder="جستجو..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="border rounded-lg p-2"
                />
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="border rounded-lg p-2"
                >
                  <option value="all">همه تراکنش‌ها</option>
                  <option value="income">درآمد</option>
                  <option value="expense">هزینه</option>
                  <option value="refund">بازگشت وجه</option>
                </select>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="border rounded-lg p-2"
                >
                  <option value="all">همه وضعیت‌ها</option>
                  <option value="successful">موفق</option>
                  <option value="pending">در انتظار</option>
                  <option value="failed">ناموفق</option>
                </select>
                <input
                  type="number"
                  placeholder="حداقل مبلغ"
                  value={filters.minAmount}
                  onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                  className="border rounded-lg p-2"
                />
                <input
                  type="number"
                  placeholder="حداکثر مبلغ"
                  value={filters.maxAmount}
                  onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                  className="border rounded-lg p-2"
                />
              </div>

              <TransactionList
                transactions={data?.transactions}
                loading={loading}
                onStatusChange={async (id, status) => {
                  await financialService.updateTransactionStatus(id, status);
                  fetchFinancialData();
                }}
              />
            </div>
          )}

          {activeTab === 'reports' && (
            <ReportGenerator
              dateRange={dateRange}
              onGenerate={async (type) => {
                const report = await financialService.generateReport(type, dateRange);
                // لینک دانلود گزارش را باز کن
                window.open(report.downloadUrl);
              }}
            />
          )}

          {activeTab === 'projections' && (
            <FinancialProjections
              data={data?.projections}
              dateRange={dateRange}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

