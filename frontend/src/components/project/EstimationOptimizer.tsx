// frontend/src/components/project/EstimationOptimizer.tsx
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { OptimizationChart } from '@/components/charts/OptimizationChart';
import { projectService } from '@/services/project.service';

export const EstimationOptimizer: React.FC<{
  projectId: string;
  currentEstimation: any;
}> = ({ projectId, currentEstimation }) => {
  const [optimizations, setOptimizations] = useState<any[]>([]);
  const [selectedOptimization, setSelectedOptimization] = useState<string | null>(null);
  const [comparison, setComparison] = useState<any>(null);

  useEffect(() => {
    generateOptimizations();
  }, [currentEstimation]);

  const generateOptimizations = async () => {
    const data = await projectService.generateOptimizations(projectId, currentEstimation);
    setOptimizations(data);
  };

  const handleOptimizationSelect = async (optimizationId: string) => {
    setSelectedOptimization(optimizationId);
    const comparisonData = await projectService.compareEstimations(
      projectId,
      currentEstimation.id,
      optimizationId
    );
    setComparison(comparisonData);
  };

  return (
    <div className="space-y-6">
      {/* گزینه‌های بهینه‌سازی */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">گزینه‌های بهینه‌سازی</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {optimizations.map(opt => (
              <OptimizationOption
                key={opt.id}
                optimization={opt}
                isSelected={selectedOptimization === opt.id}
                onClick={() => handleOptimizationSelect(opt.id)}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* مقایسه تخمین‌ها */}
      {comparison && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">مقایسه تخمین‌ها</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">مقایسه هزینه‌ها</h4>
                <OptimizationChart
                  type="cost"
                  current={comparison.costs.current}
                  optimized={comparison.costs.optimized}
                />
              </div>
              <div>
                <h4 className="font-medium mb-3">مقایسه زمانبندی</h4>
                <OptimizationChart
                  type="timeline"
                  current={comparison.timeline.current}
                  optimized={comparison.timeline.optimized}
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* جزئیات بهینه‌سازی */}
      {selectedOptimization && (
        <OptimizationDetails
          optimization={optimizations.find(opt => opt.id === selectedOptimization)}
          onApply={() => handleApplyOptimization(selectedOptimization)}
        />
      )}
    </div>
  );
};
