import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

interface PerformanceMetrics {
  timestamp: number;
  fcp: number;    // First Contentful Paint
  lcp: number;    // Largest Contentful Paint
  fid: number;    // First Input Delay
  cls: number;    // Cumulative Layout Shift
  ttfb: number;   // Time to First Byte
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);

  useEffect(() => {
    // گرفتن متریک‌های Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const metric: Partial<PerformanceMetrics> = {
          timestamp: Date.now(),
        };

        switch (entry.name) {
          case 'FCP':
            metric.fcp = entry.startTime;
            break;
          case 'LCP':
            metric.lcp = entry.startTime;
            break;
          case 'FID':
            metric.fid = entry.processingStart - entry.startTime;
            break;
          case 'CLS':
            metric.cls = entry.value;
            break;
          case 'TTFB':
            metric.ttfb = entry.startTime;
            break;
        }

        setMetrics(prev => [...prev, metric as PerformanceMetrics]);
      });
    });

    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });

    return () => observer.disconnect();
  }, []);

  const chartData = {
    labels: metrics.map(m => new Date(m.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'FCP',
        data: metrics.map(m => m.fcp),
        borderColor: 'rgb(75, 192, 192)',
      },
      {
        label: 'LCP',
        data: metrics.map(m => m.lcp),
        borderColor: 'rgb(255, 99, 132)',
      },
    ],
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Performance Metrics</h2>
      <div className="grid gap-4">
        <div className="p-4 border rounded-lg">
          <Line data={chartData} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="FCP" value={metrics[metrics.length - 1]?.fcp} threshold={2000} />
          <MetricCard title="LCP" value={metrics[metrics.length - 1]?.lcp} threshold={2500} />
          <MetricCard title="FID" value={metrics[metrics.length - 1]?.fid} threshold={100} />
          <MetricCard title="CLS" value={metrics[metrics.length - 1]?.cls} threshold={0.1} />
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: number;
  threshold: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, threshold }) => {
  const isGood = value < threshold;

  return (
    <div className={`p-4 border rounded-lg ${isGood ? 'bg-green-50' : 'bg-red-50'}`}>
      <h3 className="font-medium">{title}</h3>
      <p className={`text-2xl font-bold ${isGood ? 'text-green-600' : 'text-red-600'}`}>
        {value?.toFixed(2)}
      </p>
    </div>
  );
};