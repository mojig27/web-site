// frontend/src/components/analytics/ProjectTrendPrediction.tsx
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { PredictionChart } from '@/components/charts/PredictionChart';
import { predictionService } from '@/services/prediction.service';

export const ProjectTrendPrediction: React.FC = () => {
  const [predictions, setPredictions] = useState<any>(null);
  const [predictionConfig, setPredictionConfig] = useState({
    horizon: 30, // روزهای پیش‌بینی
    confidenceInterval: 0.95,
    scenarios: ['optimistic', 'realistic', 'pessimistic']
  });

  return (
    <div className="space-y-6">
      {/* تنظیمات پیش‌بینی */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">تنظیمات پیش‌بینی</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PredictionHorizon
              value={predictionConfig.horizon}
              onChange={(value) => handleConfigChange('horizon', value)}
            />
            <ConfidenceInterval
              value={predictionConfig.confidenceInterval}
              onChange={(value) => handleConfigChange('confidenceInterval', value)}
            />
            <ScenarioSelector
              selected={predictionConfig.scenarios}
              onChange={(value) => handleConfigChange('scenarios', value)}
            />
          </div>
        </div>
      </Card>

      {/* نمودارهای پیش‌بینی */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">پیش‌بینی پیشرفت پروژه</h3>
            <PredictionChart
              data={predictions?.progress}
              type="progress"
              config={predictionConfig}
            />
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">پیش‌بینی هزینه‌ها</h3>
            <PredictionChart
              data={predictions?.costs}
              type="cost"
              config={predictionConfig}
            />
          </div>
        </Card>
      </div>

      {/* تحلیل سناریوها */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">تحلیل سناریوها</h3>
          <ScenarioAnalysis
            scenarios={predictions?.scenarios}
            onScenarioSelect={handleScenarioSelect}
          />
        </div>
      </Card>
    </div>
  );
};

