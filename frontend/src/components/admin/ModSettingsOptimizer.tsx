// frontend/src/components/admin/ModSettingsOptimizer.tsx
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { optimizationService } from '@/services/optimization.service';

export const ModSettingsOptimizer = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);

  const startOptimization = async () => {
    try {
      setIsOptimizing(true);
      setProgress(0);

      const optimizationId = await optimizationService.startOptimization();
      await monitorOptimization(optimizationId);
    } catch (error) {
      toast.error('خطا در فرآیند بهینه‌سازی');
    } finally {
      setIsOptimizing(false);
    }
  };

  const monitorOptimization = async (optimizationId: string) => {
    const interval = setInterval(async () => {
      const status = await optimizationService.getOptimizationStatus(optimizationId);
      setProgress(status.progress);

      if (status.completed) {
        clearInterval(interval);
        setResults(status.results);
      }
    }, 1000);
  };

  const applyConfiguration = async (configId: string) => {
    try {
      await optimizationService.applyConfiguration(configId);
      toast.success('تنظیمات جدید با موفقیت اعمال شد');
    } catch (error) {
      toast.error('خطا در اعمال تنظیمات');
    }
  };

  return (
    <div className="space-y-6">
      {/* کنترل بهینه‌سازی */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">بهینه‌سازی تنظیمات</h3>
            <Button
              variant="primary"
              onClick={startOptimization}
              loading={isOptimizing}
              disabled={isOptimizing}
            >
              شروع بهینه‌سازی
            </Button>
          </div>

          {isOptimizing && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-gray-500">
                در حال تحلیل داده‌ها و یافتن بهترین تنظیمات...
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* نتایج بهینه‌سازی */}
      {results && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">پیشنهادات بهینه‌سازی</h3>
            <div className="space-y-4">
              {results.configurations.map((config: any) => (
                <div
                  key={config.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer ${
                    selectedConfig === config.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedConfig(config.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">پیکربندی {config.id}</h4>
                      <div className="mt-2 space-y-1 text-sm">
                        <p>دقت: {(config.accuracy * 100).toFixed(1)}%</p>
                        <p>نرخ تشخیص خودکار: {(config.autoRate * 100).toFixed(1)}%</p>
                        <p>زمان پردازش: {config.processingTime}ms</p>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => applyConfiguration(config.id)}
                    >
                      اعمال تنظیمات
                    </Button>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium mb-2">آستانه‌ها:</h5>
                      <ul className="space-y-1 text-gray-600">
                        {Object.entries(config.thresholds).map(([key, value]: [string, any]) => (
                          <li key={key}>
                            {getThresholdLabel(key)}: {(value * 100).toFixed()}%
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">ویژگی‌های فعال:</h5>
                      <ul className="space-y-1 text-gray-600">
                        {Object.entries(config.features).map(([key, enabled]: [string, any]) => (
                          <li key={key} className="flex items-center">
                            <span className={`w-2 h-2 rounded-full mr-2 ${
                              enabled ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            {getFeatureLabel(key)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

