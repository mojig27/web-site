// frontend/src/components/admin/loyalty/LoyaltyDashboard.tsx
import { LineChart, PieChart } from '@/components/charts';
import { formatNumber, formatCurrency } from '@/utils/format';

interface LoyaltyDashboardProps {
  data: any;
}

export const LoyaltyDashboard: React.FC<LoyaltyDashboardProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* کارت‌های آمار */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">کل امتیازات صادر شده</div>
          <div className="text-2xl font-bold mt-1">
            {formatNumber(data.totalPoints)}
          </div>
          <div className={`text-sm mt-2 ${
            data.pointsGrowth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {data.pointsGrowth > 0 ? '↑' : '↓'} {Math.abs(data.pointsGrowth)}%
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">مشتریان فعال</div>
          <div className="text-2xl font-bold mt-1">
            {formatNumber(data.activeCustomers)}
          </div>
          <div className="text-sm mt-2 text-gray-500">
            از {formatNumber(data.totalCustomers)} مشتری
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">جوایز مطالبه شده</div>
          <div className="text-2xl font-bold mt-1">
            {formatNumber(data.redeemedRewards)}
          </div>
          <div className="text-sm mt-2 text-gray-500">
            ارزش: {formatCurrency(data.rewardValue)}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">نرخ مشارکت</div>
          <div className="text-2xl font-bold mt-1">
            {data.engagementRate}%
          </div>
          <div className={`text-sm mt-2 ${
            data.engagementGrowth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {data.engagementGrowth > 0 ? '↑' : '↓'} {Math.abs(data.engagementGrowth)}%
          </div>
        </div>
      </div>

      {/* نمودارها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">روند امتیازات</h3>
          <div className="h-80">
            <LineChart
              data={data.pointsTrend}
              xKey="date"
              yKey="points"
              color="#3B82F6"
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">توزیع جوایز</h3>
          <div className="h-80">
            <PieChart
              data={data.rewardDistribution}
              nameKey="category"
              valueKey="count"
            />
          </div>
        </div>
      </div>
    </div>
  );
};