// frontend/src/components/admin/AutoModerationSettings.tsx
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Slider } from '@/components/ui/Slider';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { moderationService } from '@/services/moderation.service';
import { LineChart, BarChart } from '@/components/charts';

export const AutoModerationSettings = () => {
  const [settings, setSettings] = useState({
    thresholds: {
      spam: 0.7,
      toxic: 0.6,
      duplicate: 0.8,
      autoApprove: 0.3,
      autoReject: 0.7
    },
    features: {
      spamDetection: true,
      contentFilter: true,
      duplicateCheck: true,
      userHistory: true,
      aiAnalysis: true
    },
    actions: {
      notifyAdmins: true,
      notifyUsers: true,
      logDecisions: true,
      autoTrain: true
    }
  });

  const [stats, setStats] = useState({
    daily: [],
    accuracy: {
      overall: 0,
      byCategory: {}
    },
    decisions: {
      approved: 0,
      rejected: 0,
      reviewed: 0
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsData, statsData] = await Promise.all([
        moderationService.getAutoModerationSettings(),
        moderationService.getAutoModerationStats()
      ]);
      setSettings(settingsData);
      setStats(statsData);
    } catch (error) {
      toast.error('خطا در دریافت اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (
    category: string,
    key: string,
    value: number | boolean
  ) => {
    try {
      await moderationService.updateAutoModerationSettings({
        [category]: {
          [key]: value
        }
      });
      
      setSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [key]: value
        }
      }));

      toast.success('تنظیمات با موفقیت بروزرسانی شد');
    } catch (error) {
      toast.error('خطا در بروزرسانی تنظیمات');
    }
  };

  return (
    <div className="space-y-6">
      {/* آمار کلی */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="دقت تشخیص"
          value={`${(stats.accuracy.overall * 100).toFixed(1)}%`}
          trend={+5}
          chart={stats.daily.map(d => d.accuracy)}
        />
        <StatsCard
          title="تصمیمات خودکار"
          value={`${((stats.decisions.approved + stats.decisions.rejected) / 
            Object.values(stats.decisions).reduce((a, b) => a + b, 0) * 100).toFixed(1)}%`}
          trend={+2}
          chart={stats.daily.map(d => d.autoDecisionRate)}
        />
        <StatsCard
          title="زمان بررسی"
          value="2.3 دقیقه"
          trend={-15}
          chart={stats.daily.map(d => d.reviewTime)}
        />
      </div>

      {/* تنظیمات آستانه‌ها */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">آستانه‌های تصمیم‌گیری</h3>
          <div className="space-y-6">
            {Object.entries(settings.thresholds).map(([key, value]) => (
              <div key={key}>
                <label className="flex justify-between mb-2">
                  <span>{getThresholdLabel(key)}</span>
                  <span className="text-gray-500">{(value * 100).toFixed()}%</span>
                </label>
                <Slider
                  value={value}
                  onChange={v => handleSettingChange('thresholds', key, v)}
                  min={0}
                  max={1}
                  step={0.05}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* تنظیمات ویژگی‌ها */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">ویژگی‌های فعال</h3>
          <div className="space-y-4">
            {Object.entries(settings.features).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between">
                <span>{getFeatureLabel(key)}</span>
                <Switch
                  checked={enabled}
                  onChange={v => handleSettingChange('features', key, v)}
                />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* نمودارها و تحلیل */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">روند تصمیم‌گیری</h3>
            <LineChart
              data={stats.daily}
              series={[
                { key: 'approved', label: 'تایید شده' },
                { key: 'rejected', label: 'رد شده' },
                { key: 'reviewed', label: 'نیازمند بررسی' }
              ]}
            />
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">دقت به تفکیک دسته</h3>
            <BarChart
              data={Object.entries(stats.accuracy.byCategory).map(([key, value]) => ({
                category: getCategoryLabel(key),
                value: value
              }))}
            />
          </div>
        </Card>
      </div>

      {/* گزارش تفصیلی */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">گزارش عملکرد</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                label="کل محتوای بررسی شده"
                value={Object.values(stats.decisions).reduce((a, b) => a + b, 0)}
                trend={+12}
              />
              <MetricCard
                label="تایید خودکار"
                value={stats.decisions.approved}
                trend={+8}
              />
              <MetricCard
                label="رد خودکار"
                value={stats.decisions.rejected}
                trend={+15}
              />
              <MetricCard
                label="ارجاع به مدیر"
                value={stats.decisions.reviewed}
                trend={-5}
              />
            </div>
            
            <div className="mt-6">
              <Button
                variant="primary"
                onClick={() => moderationService.downloadReport()}
              >
                دانلود گزارش کامل
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
