// frontend/src/components/admin/dashboard/SalesChart.tsx
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
  } from 'recharts';
  
  interface SalesChartProps {
    data: Array<{
      date: string;
      amount: number;
      orders: number;
    }>;
  }
  
  export const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
    return (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => new Date(value).toLocaleDateString('fa-IR')}
            />
            <YAxis />
            <Tooltip
              formatter={(value) =>
                new Intl.NumberFormat('fa-IR').format(value as number) + ' تومان'
              }
              labelFormatter={(label) =>
                new Date(label).toLocaleDateString('fa-IR')
              }
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#4F46E5"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };
  