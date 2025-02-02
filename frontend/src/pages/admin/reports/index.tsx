// frontend/src/pages/admin/reports/index.tsx
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { SalesReport } from '@/components/admin/reports/SalesReport';
import { ProductsReport } from '@/components/admin/reports/ProductsReport';
import { CustomersReport } from '@/components/admin/reports/CustomersReport';
import { ExportButton } from '@/components/admin/reports/ExportButton';
import { DateRangePicker } from '@/components/common/DateRangePicker';

export default function AdminReports() {
  const [activeTab, setActiveTab] = useState('sales');
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date()
  });
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'sales', label: 'گزارش فروش' },
    { id: 'products', label: 'گزارش محصولات' },
    { id: 'customers', label: 'گزارش مشتریان' }
  ];

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold">گزارش‌ها</h1>
            </div>
            <div className="flex items-center gap-4">
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
              />
              <ExportButton
                type={activeTab}
                dateRange={dateRange}
              />
            </div>
          </div>

          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'sales' && (
            <SalesReport dateRange={dateRange} />
          )}
          {activeTab === 'products' && (
            <ProductsReport dateRange={dateRange} />
          )}
          {activeTab === 'customers' && (
            <CustomersReport dateRange={dateRange} />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
