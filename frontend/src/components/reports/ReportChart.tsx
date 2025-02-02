// frontend/src/components/reports/ReportChart.tsx
import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ReportChartProps {
  data: any[];
  metrics: string[];
  config: {
    colors: { [key: string]: string };
    labels: { [key: string]: string };
  };
}

export const ReportChart = ({ data, metrics, config }: ReportChartProps) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('fa-IR', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('fa-IR').format(value);
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={formatDate}
          padding={{ left: 30, right: 30 }}
        />
        <YAxis tickFormatter={formatNumber} />
        <Tooltip
          formatter={(value: number, name: string) => [
            formatNumber(value),
            config.labels[name]
          ]}
          labelFormatter={formatDate}
        />
        <Legend
          formatter={(value) => config.labels[value]}
        />
        {metrics.map((metric) => (
          <Line
            key={metric}
            type="monotone"
            dataKey={metric}
            stroke={config.colors[metric]}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
