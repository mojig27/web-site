// frontend/src/components/analytics/AnalyticsCharts.tsx
import { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { searchService } from '@/services/search.service';

interface AnalyticsChartsProps {
  contentId: string;
}

export const AnalyticsCharts = ({ contentId }: AnalyticsChartsProps) => {
  const [period, setPeriod] = useState('30d');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [contentId, period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await searchService.getAnalytics(contentId, period);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const periods = [
    { value: '7d', label: '۷ روز' },
    { value: '30d', label: '۳۰ روز' },
    { value: '90d', label: '۳ ماه' },
    { value: '1y', label: '۱ سال' }
  ];

  if (loading) {
    return <div>در حال بارگذاری...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-end space-x-2">
        {periods.map((p) => (
          <Button
            key={p.value}
            variant={period === p.value ? 'primary' : 'secondary'}
            onClick={() => setPeriod(p.value)}
          >
            {p.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Visitors Chart */}
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">بازدیدکنندگان</h3>
            <Line
              data={{
                labels: data.visitors.labels,
                datasets: [
                  {
                    label: 'بازدیدکنندگان یکتا',
                    data: data.visitors.unique,
                    borderColor: '#3B82F6',
                    tension: 0.3
                  },
                  {
                    label: 'کل بازدیدها',
                    data: data.visitors.total,
                    borderColor: '#10B981',
                    tension: 0.3
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">منابع ترافیک</h3>
            <Bar
              data={{
                labels: data.sources.labels,
                datasets: [{
                  data: data.sources.values,
                  backgroundColor: [
                    '#3B82F6',
                    '#10B981',
                    '#F59E0B',
                    '#EF4444'
                  ]
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: 'میانگین زمان مطالعه',
            value: data.engagement.avgReadTime,
            unit: 'دقیقه'
          },
          {
            label: 'نرخ پرش',
            value: data.engagement.bounceRate,
            unit: '%'
          },
          {
            label: 'اشتراک‌گذاری',
            value: data.engagement.shares,
            unit: 'بار'
          },
          {
            label: 'تعامل',
            value: data.engagement.interactions,
            unit: 'مورد'
          }
        ].map((metric) => (
          <Card key={metric.label}>
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-500">
                {metric.label}
              </h4>
              <p className="text-2xl font-semibold mt-2">
                {metric.value}
                <span className="text-sm text-gray-500 mr-1">
                  {metric.unit}
                </span>
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
