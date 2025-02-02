// frontend/src/components/admin/financial/FinancialDashboard.tsx
import { LineChart, BarChart, PieChart } from '@/components/charts';
import { formatCurrency, formatPercent } from '@/utils/format';

interface FinancialDashboardProps {
  data: any;
  dateRange: any;
  loading: boolean;
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  data,
  dateRange,
  loading
}) => {
  if (loading) return <div>در حال بارگذاری...</div>;
  if (!data) return null;

  const {
    summary,
    revenueByPeriod,
    expensesByCategory,
    profitMargins,
    cashFlow
  } = data;

  return (
    <div className="space-y-6">
      {/* خلاصه آمار */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">درآمد کل</div>
          <div className="text-2xl font-bold mt-1">
            {formatCurrency(summary.totalRevenue)}
          </div>
          <div className={`text-sm mt-2 ${
            summary.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {summary.revenueGrowth > 0 ? '↑' : '↓'} {Math.abs(summary.revenueGrowth)}%
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">سود خالص</div>
          <div className="text-2xl font-bold mt-1">
            {formatCurrency(summary.netProfit)}
          </div>
          <div className={`text-sm mt-2 ${
            summary.profitGrowth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {summary.profitGrowth > 0 ? '↑' : '↓'} {Math.abs(summary.profitGrowth)}%
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">حاشیه سود</div>
          <div className="text-2xl font-bold mt-1">
            {formatPercent(summary.profitMargin)}
          </div>
          <div className="text-sm mt-2 text-gray-500">
            نسبت به دوره قبل: {formatPercent(summary.previousProfitMargin)}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">جریان نقدی</div>
          <div className="text-2xl font-bold mt-1">
            {formatCurrency(summary.cashFlow)}
          </div>
          <div className={`text-sm mt-2 ${
            summary.cashFlowGrowth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {summary.cashFlowGrowth > 0 ? '↑' : '↓'} {Math.abs(summary.cashFlowGrowth)}%
          </div>
        </div>
      </div>

      {/* نمودارها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">روند درآمد</h3>
          <div className="h-80">
            <LineChart
              data={revenueByPeriod}
              xKey="date"
              yKey="amount"
              color="#3B82F6"
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">هزینه‌ها به تفکیک دسته</h3>
          <div className="h-80">
            <PieChart
              data={expensesByCategory}
              nameKey="category"
              valueKey="amount"
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">حاشیه سود محصولات</h3>
          <div className="h-80">
            <BarChart
              data={profitMargins}
              xKey="product"
              yKey="margin"
              color="#10B981"
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">جریان نقدی</h3>
          <div className="h-80">
            <LineChart
              data={cashFlow}
              xKey="date"
              yKey="amount"
              color="#6366F1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};