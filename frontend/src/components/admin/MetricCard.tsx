
// frontend/src/components/admin/MetricCard.tsx
interface MetricCardProps {
    label: string;
    value: number | string;
    trend?: number;
    chart?: number[];
  }
  
  const MetricCard = ({ label, value, trend, chart }: MetricCardProps) => {
    return (
      <div className="bg-white rounded-lg p-4 border">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-sm text-gray-500">{label}</h4>
            <div className="mt-1 flex items-baseline">
              <span className="text-2xl font-semibold">{value}</span>
              {trend && (
                <span className={`ml-2 text-sm ${
                  trend > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {trend > 0 ? '+' : ''}{trend}%
                </span>
              )}
            </div>
          </div>
          {chart && (
            <div className="w-20 h-12">
              <SparklineChart data={chart} />
            </div>
          )}
        </div>
      </div>
    );
  };