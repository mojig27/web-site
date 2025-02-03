// frontend/src/components/analytics/ProjectComparison.tsx
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { ComparisonChart } from '@/components/charts/ComparisonChart';
import { comparisonService } from '@/services/comparison.service';

export const ProjectComparison: React.FC = () => {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [benchmarks, setBenchmarks] = useState<any>(null);

  const loadComparisonData = async () => {
    const data = await comparisonService.getProjectsComparison(selectedProjects);
    setComparisonData(data);
  };

  return (
    <div className="space-y-6">
      {/* انتخاب پروژه‌ها */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">انتخاب پروژه‌ها برای مقایسه</h3>
          <ProjectSelector
            selected={selectedProjects}
            onChange={setSelectedProjects}
            maxSelection={5}
          />
        </div>
      </Card>

      {/* مقایسه کلی */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ComparisonMetricCard
          title="پیشرفت کلی"
          data={comparisonData?.progress}
          benchmark={benchmarks?.progress}
          type="percentage"
        />
        <ComparisonMetricCard
          title="کارایی هزینه"
          data={comparisonData?.costEfficiency}
          benchmark={benchmarks?.costEfficiency}
          type="ratio"
        />
        <ComparisonMetricCard
          title="شاخص ریسک"
          data={comparisonData?.riskIndex}
          benchmark={benchmarks?.riskIndex}
          type="score"
        />
      </div>

      {/* نمودارهای مقایسه‌ای */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">مقایسه زمانی</h3>
            <TimelineComparisonChart data={comparisonData?.timeline} />
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">مقایسه هزینه</h3>
            <CostComparisonChart data={comparisonData?.costs} />
          </div>
        </Card>
      </div>

      {/* تحلیل تفاوت‌ها */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">تحلیل تفاوت‌ها</h3>
          <VarianceAnalysis data={comparisonData?.variance} />
        </div>
      </Card>
    </div>
  );
};

