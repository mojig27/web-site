
// frontend/src/components/admin/analytics/BehaviorAnalytics.tsx
import { useState } from 'react';
import { LineChart, BarChart, PieChart } from '@/components/charts';
import { formatNumber, formatPercent } from '@/utils/format';

interface BehaviorAnalyticsProps {
  data: any;
  dateRange: any;
  selectedSegment: string | null;
  onSegmentChange: (segmentId: string | null) => void;
}

export const BehaviorAnalytics: React.FC<BehaviorAnalyticsProps> = ({
  data,
  dateRange,
  selectedSegment,
  onSegmentChange
}) => {
  const [metricType, setMetricType] = useState('pageviews');

  const metrics = {
    pageviews: {
      label: 'بازدید صفحات',
      color: '#3B82F6'
    },
    sessions: {
      label: 'نشست‌ها',
      color: '#10B981'
    },
    conversions: {
      label: 'تبدیل‌ها',
      color: '#6366F1'
    }
  };

  return (
    <div className="space-y-6">
      {/* کارت‌های آمار */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">کاربران فعال</div>
          <div className="text-2xl font-bold mt-1">
            {formatNumber(data.activeUsers)}
          </div>
          <div className={`text-sm mt-2 ${
            data.activeUsersGrowth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {data.activeUsersGrowth > 0 ? '↑' : '↓'} {Math.abs(data.activeUsersGrowth)}%
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">میانگین زمان بازدید</div>
          <div className="text-2xl font-bold mt-1">
            {data.averageSessionDuration}
          </div>
          <div className="text-sm mt-2 text-gray-500">
            دقیقه در هر نشست
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">نرخ تبدیل</div>
          <div className="text-2xl font-bold mt-1">
            {formatPercent(data.conversionRate)}
          </div>
          <div className={`text-sm mt-2 ${
            data.conversionRateChange >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {data.conversionRateChange > 0 ? '↑' : '↓'} {Math.abs(data.conversionRateChange)}%
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">نرخ بازگشت</div>
          <div className="text-2xl font-bold mt-1">
            {formatPercent(data.bounceRate)}
          </div>
          <div className={`text-sm mt-2 ${
            data.bounceRateChange <= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {data.bounceRateChange > 0 ? '↑' : '↓'} {Math.abs(data.bounceRateChange)}%
          </div>
        </div>
      </div>

      {/* نمودارها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">روند در طول زمان</h3>
            <select
              value={metricType}
              onChange={(e) => setMetricType(e.target.value)}
              className="border rounded-md p-1"
            >
              {Object.entries(metrics).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="h-80">
            <LineChart
              data={data.trends[metricType]}
              xKey="date"
              yKey="value"
              color={metrics[metricType as keyof typeof metrics].color}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">مسیر تبدیل</h3>
          <div className="h-80">
            <FunnelChart
              data={data.conversionFunnel}
              nameKey="stage"
              valueKey="users"
            />
          </div>
        </div>
      </div>

      {/* جداول تحلیلی */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">صفحات پربازدید</h3>
          <table className="w-full">
            <thead>
              <tr className="text-right border-b">
                <th className="pb-2">صفحه</th>
                <th className="pb-2">بازدید</th>
                <th className="pb-2">نرخ تبدیل</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.topPages.map((page: any) => (
                <tr key={page.path}>
                  <td className="py-2">{page.title}</td>
                  <td className="py-2">{formatNumber(page.views)}</td>
                  <td className="py-2">{formatPercent(page.conversionRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">منابع ترافیک</h3>
          <div className="h-80">
            <PieChart
              data={data.trafficSources}
              nameKey="source"
              valueKey="sessions"
            />
          </div>
        </div>
      </div>
    </div>
  );
};