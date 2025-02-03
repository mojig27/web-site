// frontend/src/components/project/ProjectEstimator.tsx
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Timeline } from '@/components/ui/Timeline';
import { GanttChart } from '@/components/charts/GanttChart';
import { projectService } from '@/services/project.service';

export const ProjectEstimator: React.FC<{
  projectId: string;
  materials: any[];
}> = ({ projectId, materials }) => {
  const [estimation, setEstimation] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateEstimations();
  }, [materials]);

  const calculateEstimations = async () => {
    try {
      setLoading(true);
      const [costData, timelineData] = await Promise.all([
        projectService.calculateCosts(projectId, materials),
        projectService.generateTimeline(projectId, materials)
      ]);

      setEstimation(costData);
      setTimeline(timelineData);
    } catch (error) {
      toast.error('خطا در محاسبه تخمین‌ها');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* خلاصه تخمین */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <EstimationCard
          title="هزینه کل"
          value={estimation?.totalCost}
          breakdown={estimation?.costBreakdown}
          type="cost"
        />
        <EstimationCard
          title="زمان اجرا"
          value={estimation?.totalTime}
          breakdown={estimation?.timeBreakdown}
          type="time"
        />
        <EstimationCard
          title="نیروی انسانی"
          value={estimation?.laborCount}
          breakdown={estimation?.laborBreakdown}
          type="labor"
        />
      </div>

      {/* جزئیات هزینه */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">جزئیات هزینه</h3>
          <div className="space-y-4">
            {estimation?.costBreakdown.map((item: any) => (
              <CostBreakdownItem
                key={item.category}
                item={item}
                onAdjust={handleCostAdjustment}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* زمانبندی پروژه */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">زمانبندی پروژه</h3>
          <div className="h-96">
            <GanttChart
              data={timeline}
              onTaskUpdate={handleTaskUpdate}
              onDependencyAdd={handleDependencyAdd}
            />
          </div>
        </div>
      </Card>

      {/* مراحل اجرا */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">مراحل اجرا</h3>
          <Timeline
            items={timeline}
            currentStep={estimation?.currentStep}
            onStepClick={handleStepClick}
          />
        </div>
      </Card>
    </div>
  );
};
