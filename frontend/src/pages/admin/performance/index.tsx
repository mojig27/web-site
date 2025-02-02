// frontend/src/pages/admin/performance/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { PerformanceMetrics } from '@/components/admin/performance/PerformanceMetrics';
import { EmployeeStats } from '@/components/admin/performance/EmployeeStats';
import { TasksReport } from '@/components/admin/performance/TasksReport';
import { performanceService } from '@/services/performance.service';
import { DateRangePicker } from '@/components/common/DateRangePicker';
import { ExportButton } from '@/components/common/ExportButton';

export default function AdminPerformance() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    from: new Date('2025-01-02'),
    to: new Date('2025-02-02')
  });
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  const tabs = [
    { id: 'overview', label: 'نمای کلی' },
    { id: 'tasks', label: 'وظایف و پروژه‌ها' },
    { id: 'support', label: 'پشتیبانی مشتریان' },
    { id: 'sales', label: 'عملکرد فروش' }
  ];

  useEffect(() => {
    fetchPerformanceData();
  }, [activeTab, dateRange, selectedEmployee]);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const response = await performanceService.getPerformanceData({
        type: activeTab,
        dateRange,
        employeeId: selectedEmployee
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">گزارش عملکرد کارمندان</h1>
            <div className="flex items-center gap-4">
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                presets={[
                  { label: 'هفته جاری', days: 7 },
                  { label: 'ماه جاری', days: 30 },
                  { label: 'سه ماه اخیر', days: 90 }
                ]}
              />
              <ExportButton
                data={data}
                filename={`performance-${activeTab}`}
              />
            </div>
          </div>
        </div>

        <div className="border-b">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
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
          {loading ? (
            <div className="text-center py-12">در حال بارگذاری...</div>
          ) : (
            <div className="space-y-6">
              {/* متریک‌های کلیدی */}
              <PerformanceMetrics
                metrics={data?.metrics}
                type={activeTab}
              />

              {/* آمار کارمندان */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <EmployeeStats
                    employees={data?.employees}
                    selectedId={selectedEmployee}
                    onSelect={setSelectedEmployee}
                    dateRange={dateRange}
                  />
                </div>

                <div className="lg:col-span-2">
                  {activeTab === 'tasks' ? (
                    <TasksReport
                      tasks={data?.tasks}
                      employeeId={selectedEmployee}
                    />
                  ) : activeTab === 'support' ? (
                    <SupportStats
                      stats={data?.supportStats}
                      employeeId={selectedEmployee}
                    />
                  ) : activeTab === 'sales' ? (
                    <SalesPerformance
                      sales={data?.salesData}
                      employeeId={selectedEmployee}
                    />
                  ) : (
                    <PerformanceOverview
                      data={data}
                      employeeId={selectedEmployee}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
