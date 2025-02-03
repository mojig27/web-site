// frontend/src/components/risk/RiskPrediction.tsx
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { LineChart } from '@/components/charts/LineChart';
import { riskService } from '@/services/risk.service';

export const RiskPrediction: React.FC<{
  projectId: string;
}> = ({ projectId }) => {
  const [predictions, setPredictions] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    fetchPredictions();
    initializeRealTimeAlerts();
  }, [projectId]);

  const fetchPredictions = async () => {
    const data = await riskService.getPredictions(projectId);
    setPredictions(data);
  };

  return (
    <div className="space-y-6">
      {/* نمودار پیش‌بینی ریسک */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">روند ریسک‌های پیش‌بینی شده</h3>
          <div className="h-80">
            <LineChart
              data={predictions?.trendData}
              xAxis="date"
              series={[
                { name: 'ریسک واقعی', key: 'actual' },
                { name: 'ریسک پیش‌بینی شده', key: 'predicted' }
              ]}
            />
          </div>
        </div>
      </Card>

      {/* هشدارهای پیش‌بینی شده */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">هشدارهای پیش‌بینی شده</h3>
          <div className="space-y-4">
            {predictions?.alerts.map((alert: any) => (
              <PredictedAlertCard
                key={alert.id}
                alert={alert}
                onActionTake={handleAlertAction}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
