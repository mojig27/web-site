
// frontend/src/components/admin/api/APIMetrics.tsx
import { useState } from 'react';
import { LineChart, BarChart } from '@/components/charts';
import { formatNumber } from '@/utils/format';

interface APIMetricsProps {
  metrics: any;
  onTimeRangeChange: (range: string) => void;
}

export const APIMetrics: React.FC<APIMetricsProps> = ({
  metrics,
  onTimeRangeChange
}) => {
  const [timeRange, setTimeRange] = useState('24h');

  const handleRangeChange = (range: string) => {
    setTimeRange(range);
    onTimeRangeChange(range);
  };

  return (
    <div className="space-y-6">
      {/* کارت‌های آمار */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">تعداد درخواست‌ها</div>
          <div className="text-2xl font-bold mt-1">
            {formatNumber(metrics.totalRequests)}
          </div>
          <div className={`text-sm mt-2 ${
            metrics.requestsGrowth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {metrics.requestsGrowth > 0 ? '↑' : '↓'} {Math.abs(metrics.requestsGrowth)}%
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">میانگین زمان پاسخ</div>
          <div className="text-2xl font-bold mt-1">
            {metrics.averageResponseTime}ms
          </div>
          <div className="text-sm mt-2 text-gray-500">
            در {timeRange} گذشته
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">نرخ خطا</div>
          <div className="text-2xl font-bold mt-1">
            {metrics.errorRate}%
          </div>
          <div className={`text-sm mt-2 ${
            metrics.errorRateChange >= 0 ? 'text-red-600' : 'text-green-600'
          }`}>
            {metrics.errorRateChange > 0 ? '↑' : '↓'} {Math.abs(metrics.errorRateChange)}%
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">کاربران فعال API</div>
          <div className="text-2xl font-bold mt-1">
            {formatNumber(metrics.activeUsers)}
          </div>
          <div className="text-sm mt-2 text-gray-500">
            در {timeRange} گذشته
          </div>
        </div>
      </div>

      {/* نمودارها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">درخواست‌ها در طول زمان</h3>
            <select
              value={timeRange}
              onChange={(e) => handleRangeChange(e.target.value)}
              className="border rounded-md p-1"
            >
              <option value="1h">1 ساعت</option>
              <option value="24h">24 ساعت</option>
              <option value="7d">7 روز</option>
              <option value="30d">30 روز</option>
            </select>
          </div>
          <div className="h-80">
            <LineChart
              data={metrics.requestsOverTime}
              xKey="timestamp"
              yKey="count"
              color="#3B82F6"
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">درخواست‌ها به تفکیک Endpoint</h3>
          <div className="h-80">
            <BarChart
              data={metrics.requestsByEndpoint}
              xKey="endpoint"
              yKey="count"
              color="#10B981"
            />
          </div>
        </div>
      </div>
    </div>
  );
};