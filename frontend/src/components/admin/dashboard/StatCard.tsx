
// frontend/src/components/admin/dashboard/StatCard.tsx
interface StatCardProps {
  title: string;
  value: number;
  type: 'currency' | 'number';
  change?: number;
  icon: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  type,
  change,
  icon
}) => {
  const formatValue = (val: number) => {
    if (type === 'currency') {
      return new Intl.NumberFormat('fa-IR').format(val) + ' تومان';
    }
    return new Intl.NumberFormat('fa-IR').format(val);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{formatValue(value)}</h3>
        </div>
        <div className={`rounded-full p-3 ${getIconBackground(icon)}`}>
          {getIcon(icon)}
        </div>
      </div>
      {change !== undefined && (
        <div className={`mt-4 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          <span className="text-sm">
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          </span>
          <span className="text-gray-500 text-sm mr-1">نسبت به روز قبل</span>
        </div>
      )}
    </div>
  );
};


