// frontend/src/pages/admin/user-analytics/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { BehaviorAnalytics } from '@/components/admin/analytics/BehaviorAnalytics';
import { UserSegments } from '@/components/admin/analytics/UserSegments';
import { PersonalizationRules } from '@/components/admin/analytics/PersonalizationRules';
import { analyticsService } from '@/services/analytics.service';

export default function AdminUserAnalytics() {
  const [activeTab, setActiveTab] = useState('behavior');
  const [dateRange, setDateRange] = useState({
    from: new Date('2025-01-02'),
    to: new Date('2025-02-02')
  });
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  const tabs = [
    { id: 'behavior', label: 'تحلیل رفتار' },
    { id: 'segments', label: 'بخش‌بندی کاربران' },
    { id: 'personalization', label: 'شخصی‌سازی' },
    { id: 'heatmaps', label: 'نقشه حرارتی' }
  ];

  useEffect(() => {
    fetchAnalyticsData();
  }, [activeTab, dateRange, selectedSegment]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await analyticsService.getUserAnalytics({
        tab: activeTab,
        dateRange,
        segmentId: selectedSegment
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">تحلیل رفتار کاربران و شخصی‌سازی</h1>
            <div className="flex items-center gap-4">
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                presets={[
                  { label: 'امروز', days: 0 },
                  { label: 'هفته جاری', days: 7 },
                  { label: 'ماه جاری', days: 30 },
                  { label: 'سه ماه اخیر', days: 90 }
                ]}
              />
              <button
                onClick={() => setActiveTab('segments')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                ایجاد بخش جدید
              </button>
            </div>
          </div>
        </div>

        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">در حال بارگذاری...</div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'behavior' && (
                <BehaviorAnalytics
                  data={data}
                  dateRange={dateRange}
                  selectedSegment={selectedSegment}
                  onSegmentChange={setSelectedSegment}
                />
              )}

              {activeTab === 'segments' && (
                <UserSegments
                  segments={data?.segments}
                  onSave={async (segmentData) => {
                    if (segmentData.id) {
                      await analyticsService.updateSegment(segmentData.id, segmentData);
                    } else {
                      await analyticsService.createSegment(segmentData);
                    }
                    await fetchAnalyticsData();
                  }}
                  onDelete={async (id) => {
                    if (window.confirm('آیا از حذف این بخش اطمینان دارید؟')) {
                      await analyticsService.deleteSegment(id);
                      await fetchAnalyticsData();
                    }
                  }}
                />
              )}

              {activeTab === 'personalization' && (
                <PersonalizationRules
                  rules={data?.rules}
                  segments={data?.segments}
                  onSave={async (ruleData) => {
                    if (ruleData.id) {
                      await analyticsService.updateRule(ruleData.id, ruleData);
                    } else {
                      await analyticsService.createRule(ruleData);
                    }
                    await fetchAnalyticsData();
                  }}
                />
              )}

              {activeTab === 'heatmaps' && (
                <HeatmapViewer
                  data={data?.heatmaps}
                  pages={data?.pages}
                  dateRange={dateRange}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
