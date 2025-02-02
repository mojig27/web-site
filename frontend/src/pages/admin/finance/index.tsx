// frontend/src/pages/admin/finance/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { FinancialDashboard } from '@/components/admin/finance/FinancialDashboard';
import { TransactionList } from '@/components/admin/finance/TransactionList';
import { ReportGenerator } from '@/components/admin/finance/ReportGenerator';
import { financeService } from '@/services/finance.service';

export default function AdminFinance() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    transactions: [],
    reports: [],
    stats: {},
    balances: {}
  });
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    status: 'all',
    dateRange: 'all',
    search: ''
  });

  const tabs = [
    { id: 'dashboard', label: 'داشبورد مالی' },
    { id: 'transactions', label: 'تراکنش‌ها' },
    { id: 'reports', label: 'گزارش‌ها' },
    { id: 'budget', label: 'بودجه‌بندی' }
  ];

  useEffect(() => {
    fetchFinanceData();
  }, [activeTab, selectedPeriod, filters]);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const response = await financeService.getData({
        tab: activeTab,
        period: selectedPeriod,
        filters
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">مدیریت گزارش‌های مالی</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                <span className="text-sm text-green-800">
                  موجودی کل: {new Intl.NumberFormat('fa-IR').format(data.stats?.totalBalance || 0)} تومان
                </span>
              </div>
              <button
                onClick={() => setActiveTab('reports')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                گزارش جدید
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
          {/* فیلترهای زمانی */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border rounded-lg p-2"
              >
                <option value="day">امروز</option>
                <option value="week">این هفته</option>
                <option value="month">این ماه</option>
                <option value="quarter">این فصل</option>
                <option value="year">امسال</option>
                <option value="custom">بازه زمانی دلخواه</option>
              </select>

              {selectedPeriod === 'custom' && (
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    className="border rounded-lg p-2"
                    onChange={(e) => {
                      // Handle date range start
                    }}
                  />
                  <span>تا</span>
                  <input
                    type="date"
                    className="border rounded-lg p-2"
                    onChange={(e) => {
                      // Handle date range end
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {activeTab === 'dashboard' && (
            <FinancialDashboard
              stats={data.stats}
              balances={data.balances}
              period={selectedPeriod}
              loading={loading}
            />
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-6">
              {/* فیلترهای تراکنش */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="جستجوی تراکنش..."
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
                  <option value="transfer">انتقال</option>
                </select>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="border rounded-lg p-2"
                >
                  <option value="all">همه دسته‌ها</option>
                  <option value="sales">فروش</option>
                  <option value="salary">حقوق</option>
                  <option value="rent">اجاره</option>
                  <option value="utility">قبوض</option>
                  <option value="other">سایر</option>
                </select>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="border rounded-lg p-2"
                >
                  <option value="all">همه وضعیت‌ها</option>
                  <option value="completed">تکمیل شده</option>
                  <option value="pending">در انتظار</option>
                  <option value="failed">ناموفق</option>
                </select>
              </div>

              {/* لیست تراکنش‌ها */}
              <TransactionList
                transactions={data.transactions}
                loading={loading}
                onStatusChange={async (transactionId, status) => {
                  await financeService.updateTransactionStatus(transactionId, status);
                  await fetchFinanceData();
                }}
              />
            </div>
          )}

          {activeTab === 'reports' && (
            <ReportGenerator
              data={data}
              period={selectedPeriod}
              onGenerate={async (reportConfig) => {
                const report = await financeService.generateReport(reportConfig);
                // Handle report generation
              }}
            />
          )}

          {activeTab === 'budget' && (
            <BudgetManager
              budgets={data.budgets}
              expenses={data.expenses}
              onUpdate={async (budgetData) => {
                await financeService.updateBudget(budgetData);
                await fetchFinanceData();
              }}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}