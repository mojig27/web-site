
// frontend/src/components/admin/performance/EmployeeStats.tsx
import { formatNumber, formatDate } from '@/utils/format';

interface EmployeeStatsProps {
  employees: any[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  dateRange: any;
}

export const EmployeeStats: React.FC<EmployeeStatsProps> = ({
  employees,
  selectedId,
  onSelect,
  dateRange
}) => {
  return (
    <div className="bg-white border rounded-lg">
      <div className="p-4 border-b">
        <h3 className="font-medium">عملکرد کارمندان</h3>
      </div>
      <div className="divide-y">
        {employees?.map((employee) => (
          <div
            key={employee._id}
            className={`
              p-4 cursor-pointer transition
              ${selectedId === employee._id ? 'bg-blue-50' : 'hover:bg-gray-50'}
            `}
            onClick={() => onSelect(employee._id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{employee.name}</div>
                <div className="text-sm text-gray-500">{employee.role}</div>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium">
                  {formatNumber(employee.score)}
                </div>
                <div className={`text-sm ${
                  employee.trend > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {employee.trend > 0 ? '↑' : '↓'} {Math.abs(employee.trend)}%
                </div>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
              <div>
                <div className="text-gray-500">وظایف</div>
                <div>{employee.stats.tasks.completed}/{employee.stats.tasks.total}</div>
              </div>
              <div>
                <div className="text-gray-500">پشتیبانی</div>
                <div>{formatNumber(employee.stats.support.satisfaction)}%</div>
              </div>
              <div>
                <div className="text-gray-500">فروش</div>
                <div>{formatNumber(employee.stats.sales.conversion)}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};