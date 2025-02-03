// frontend/src/components/admin/AnalyticsReport.tsx
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { analyticsService } from '@/services/analytics.service';

export const AnalyticsReport = () => {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date()
  });

  const [filters, setFilters] = useState({
    groupBy: 'day',
    contentTypes: ['all'],
    metrics: ['accuracy', 'latency', 'autoDecision']
  });

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.generateReport({
        dateRange,
        filters
      });
      setReport(data);
    } catch (error) {
      toast.error('خطا در تولید گزارش');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* فیلترهای گزارش */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">تنظیمات گزارش</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">بازه زمانی</label>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                maxDate={new Date()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">گروه‌بندی</label>
              <Select
                value={filters.groupBy}
                onChange={(value) => setFilters(prev => ({
                  ...prev,
                  groupBy: value
                }))}
                options={[
                  { value: 'hour', label: 'ساعتی' },
                  { value: 'day', label: 'روزانه' },
                  { value: 'week', label: 'هفتگی' },
                  { value: 'month', label: 'ماهانه' }
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">نوع محتوا</label>
              <Select
                value={filters.contentTypes}
                onChange={(value) => setFilters(prev => ({
                  ...prev,
                  contentTypes: value
                }))}
                multiple
                options={[
                  { value: 'all', label: 'همه' },
                  { value: 'comment', label: 'نظرات' },
                  { value: 'post', label: 'پست‌ها' },
                  { value: 'review', label: 'نقدها' }
                ]}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="primary"
              onClick={generateReport}
              loading={loading}
            >
              تولید گزارش
            </Button>
          </div>
        </div>
      </Card>

      {/* نتایج گزارش */}
      {report && (
        <>
          {/* خلاصه آماری */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">خلاصه آماری</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatBox
                  label="تعداد کل محتوا"
                  value={report.summary.totalContent}
                  trend={report.summary.contentTrend}
                />
                <StatBox
                  label="میانگین دقت"
                  value={`${report.summary.avgAccuracy}%`}
                  trend={report.summary.accuracyTrend}
                />
                <StatBox
                  label="نرخ تصمیم خودکار"
                  value={`${report.summary.autoDecisionRate}%`}
                  trend={report.summary.autoDecisionTrend}
                />
                <StatBox
                  label="میانگین زمان پردازش"
                  value={`${report.summary.avgProcessingTime}ms`}
                  trend={report.summary.processingTimeTrend}
                />
              </div>
            </div>
          </Card>

          {/* نمودارهای تحلیلی */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">روند دقت تشخیص</h3>
                <AccuracyTrendChart data={report.accuracyTrend} />
              </div>
            </Card>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">توزیع تصمیمات</h3>
                <DecisionDistributionChart data={report.decisionDistribution} />
              </div>
            </Card>
          </div>

          {/* جزئیات آماری */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">جزئیات آماری</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th>دوره</th>
                      <th>تعداد محتوا</th>
                      <th>دقت</th>
                      <th>تصمیم خودکار</th>
                      <th>زمان پردازش</th>
                      <th>نرخ خطا</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.details.map((row: any, index: number) => (
                      <tr key={index}>
                        <td>{row.period}</td>
                        <td>{row.contentCount}</td>
                        <td>{row.accuracy}%</td>
                        <td>{row.autoDecisionRate}%</td>
                        <td>{row.processingTime}ms</td>
                        <td>{row.errorRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          {/* توصیه‌های بهبود */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">توصیه‌های بهبود</h3>
              <div className="space-y-4">
                {report.recommendations.map((rec: any, index: number) => (
                  <RecommendationItem
                    key={index}
                    recommendation={rec}
                    onApply={() => applyRecommendation(rec.id)}
                  />
                ))}
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

