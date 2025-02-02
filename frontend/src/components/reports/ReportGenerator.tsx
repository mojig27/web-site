// frontend/src/components/reports/ReportGenerator.tsx
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DateRangePicker } from '@/components/forms/DateRangePicker';
import { reportService } from '@/services/report.service';
import { ReportChart } from './ReportChart';
import { ReportTable } from './ReportTable';

interface ReportConfig {
  type: string;
  metrics: string[];
  filters: any;
  dateRange: {
    start: Date;
    end: Date;
  };
  groupBy: string;
}

export const ReportGenerator = () => {
  const [config, setConfig] = useState<ReportConfig>({
    type: 'content',
    metrics: ['views', 'visitors'],
    filters: {},
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date()
    },
    groupBy: 'day'
  });
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { value: 'content', label: 'محتوا' },
    { value: 'users', label: 'کاربران' },
    { value: 'categories', label: 'دسته‌بندی‌ها' },
    { value: 'engagement', label: 'تعاملات' }
  ];

  const metricOptions = {
    content: [
      { value: 'views', label: 'بازدیدها' },
      { value: 'visitors', label: 'بازدیدکنندگان' },
      { value: 'avgTime', label: 'میانگین زمان مطالعه' },
      { value: 'shares', label: 'اشتراک‌گذاری‌ها' }
    ],
    users: [
      { value: 'registrations', label: 'ثبت‌نام‌ها' },
      { value: 'activeUsers', label: 'کاربران فعال' },
      { value: 'contributions', label: 'مشارکت‌ها' }
    ]
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      const response = await reportService.generate(config);
      setReport(response.data);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format: string) => {
    try {
      const response = await reportService.export({
        ...config,
        format
      });
      
      const blob = new Blob([response.data], {
        type: response.headers['content-type']
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${Date.now()}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-medium">تنظیمات گزارش</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium mb-2">
                نوع گزارش
              </label>
              <select
                value={config.type}
                onChange={(e) => setConfig({
                  ...config,
                  type: e.target.value,
                  metrics: []
                })}
                className="w-full rounded-lg border-gray-300"
              >
                {reportTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Metrics */}
            <div>
              <label className="block text-sm font-medium mb-2">
                معیارها
              </label>
              <div className="space-y-2">
                {metricOptions[config.type]?.map(metric => (
                  <label key={metric.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.metrics.includes(metric.value)}
                      onChange={(e) => {
                        const metrics = e.target.checked
                          ? [...config.metrics, metric.value]
                          : config.metrics.filter(m => m !== metric.value);
                        setConfig({ ...config, metrics });
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="mr-2">{metric.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">
                بازه زمانی
              </label>
              <DateRangePicker
                startDate={config.dateRange.start}
                endDate={config.dateRange.end}
                onChange={(start, end) => setConfig({
                  ...config,
                  dateRange: { start, end }
                })}
              />
            </div>

            {/* Group By */}
            <div>
              <label className="block text-sm font-medium mb-2">
                گروه‌بندی
              </label>
              <select
                value={config.groupBy}
                onChange={(e) => setConfig({
                  ...config,
                  groupBy: e.target.value
                })}
                className="w-full rounded-lg border-gray-300"
              >
                <option value="hour">ساعتی</option>
                <option value="day">روزانه</option>
                <option value="week">هفتگی</option>
                <option value="month">ماهانه</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="primary"
              onClick={generateReport}
              loading={loading}
            >
              ایجاد گزارش
            </Button>
          </div>
        </div>
      </Card>

      {report && (
        <>
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">نمودار گزارش</h2>
                <div className="space-x-2">
                  <Button
                    variant="secondary"
                    onClick={() => exportReport('pdf')}
                  >
                    خروجی PDF
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => exportReport('excel')}
                  >
                    خروجی Excel
                  </Button>
                </div>
              </div>
              <ReportChart data={report.chart} />
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">جزئیات گزارش</h2>
              <ReportTable data={report.details} />
            </div>
          </Card>
        </>
      )}
    </div>
  );
};