// frontend/src/components/analytics/AdvancedReporting.tsx
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { AnalyticsChart } from '@/components/charts/AnalyticsChart';
import { analyticsService } from '@/services/analytics.service';
import { ExportOptions } from '@/components/analytics/ExportOptions';

export const AdvancedReporting: React.FC = () => {
  const [reportConfig, setReportConfig] = useState({
    timeRange: 'last30days',
    metrics: ['revenue', 'costs', 'risks', 'progress'],
    groupBy: 'project',
    visualization: 'chart'
  });

  const [reportData, setReportData] = useState<any>(null);

  return (
    <div className="space-y-6">
      {/* تنظیمات گزارش */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">تنظیمات گزارش</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ReportTimeRange
              value={reportConfig.timeRange}
              onChange={(value) => handleConfigChange('timeRange', value)}
            />
            <ReportMetrics
              selected={reportConfig.metrics}
              onChange={(value) => handleConfigChange('metrics', value)}
            />
            <ReportGrouping
              value={reportConfig.groupBy}
              onChange={(value) => handleConfigChange('groupBy', value)}
            />
            <ReportVisualization
              value={reportConfig.visualization}
              onChange={(value) => handleConfigChange('visualization', value)}
            />
          </div>
        </div>
      </Card>

      {/* نمایش گزارش */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">گزارش تحلیلی</h3>
            <ExportOptions
              data={reportData}
              config={reportConfig}
              onExport={handleExport}
            />
          </div>
          <div className="h-[600px]">
            <AnalyticsChart
              data={reportData}
              config={reportConfig}
              onDrillDown={handleDrillDown}
            />
          </div>
        </div>
      </Card>

      {/* تحلیل‌های پیشرفته */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">تحلیل روند</h3>
            <TrendAnalysis data={reportData?.trends} />
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">پیش‌بینی‌های هوشمند</h3>
            <PredictiveAnalysis data={reportData?.predictions} />
          </div>
        </Card>
      </div>
    </div>
  );
};
