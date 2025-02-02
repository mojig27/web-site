
// frontend/src/components/admin/reports/SalesReport.tsx
import { useState, useEffect } from 'react';
import { reportService } from '@/services/report.service';
import { LineChart, BarChart } from '@/components/charts';
import { formatPrice } from '@/utils/format';

interface SalesReportProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

export const SalesReport: React.FC<SalesReportProps> = ({ dateRange }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesReport();
  }, [dateRange]);

  const fetchSalesReport = async () => {
    try {
      setLoading(true);
      const response = await reportService.getSalesReport(dateRange);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching sales report:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>در حال بارگذاری...</div>;

  return (
    <div className="space-y-8">
      {/* خلاصه آمار */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">کل فروش</div>
          <div className="text-2xl font-bold mt-1">
            {formatPrice(data.totalSales)}
          </div>
          <div className={`text-sm mt-2 ${
            data.salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {data.salesGrowth >= 0 ? '↑' : '↓'} {Math.abs(data.salesGrowth)}%
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">تعداد سفارش‌ها</div>
          <div className="text-2xl font-bold mt-1">
            {data.totalOrders}
          </div>
          <div className={`text-sm mt-2 ${
            data.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {data.ordersGrowth >= 0 ? '↑' : '↓'} {Math.abs(data.ordersGrowth)}%
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">میانگین سبد خرید</div>
          <div className="text-2xl font-bold mt-1">
            {formatPrice(data.averageOrderValue)}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">نرخ تبدیل</div>
          <div className="text-2xl font-bold mt-1">
            {data.conversionRate}%
          </div>
        </div>
      </div>

      {/* نمودار فروش */}
      <div>
        <h3 className="text-lg font-medium mb-4">روند فروش</h3>
        <LineChart
          data={data.salesTrend}
          xKey="date"
          yKey="amount"
          yLabel="مبلغ فروش (تومان)"
        />
      </div>

      {/* نمودار روش‌های پرداخت */}
      <div>
        <h3 className="text-lg font-medium mb-4">روش‌های پرداخت</h3>
        <BarChart
          data={data.paymentMethods}
          xKey="method"
          yKey="count"
          yLabel="تعداد تراکنش"
        />
      </div>

      {/* جدول فروش محصولات */}
      <div>
        <h3 className="text-lg font-medium mb-4">پرفروش‌ترین محصولات</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                  محصول
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                  تعداد فروش
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                  درآمد
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                  سود
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.topProducts.map((product: any) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-10 h-10 rounded-lg object-cover ml-3"
                      />
                      <span>{product.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.soldCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatPrice(product.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatPrice(product.profit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
