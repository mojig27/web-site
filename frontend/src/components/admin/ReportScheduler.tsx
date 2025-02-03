// frontend/src/components/admin/ReportScheduler.tsx
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { TimePicker } from '@/components/ui/TimePicker';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { reportService } from '@/services/report.service';

export const ReportScheduler = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [newSchedule, setNewSchedule] = useState({
    type: 'daily',
    time: '00:00',
    recipients: [],
    metrics: [],
    enabled: true
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    const response = await reportService.getSchedules();
    setSchedules(response.data);
  };

  const handleSave = async () => {
    await reportService.createSchedule(newSchedule);
    fetchSchedules();
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* تنظیمات گزارش جدید */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">زمانبندی گزارش جدید</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">دوره گزارش</label>
              <Select
                value={newSchedule.type}
                onChange={(value) => setNewSchedule(prev => ({
                  ...prev,
                  type: value
                }))}
                options={[
                  { value: 'daily', label: 'روزانه' },
                  { value: 'weekly', label: 'هفتگی' },
                  { value: 'monthly', label: 'ماهانه' }
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">زمان ارسال</label>
              <TimePicker
                value={newSchedule.time}
                onChange={(time) => setNewSchedule(prev => ({
                  ...prev,
                  time
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">دریافت‌کنندگان</label>
              <Select
                multiple
                value={newSchedule.recipients}
                onChange={(value) => setNewSchedule(prev => ({
                  ...prev,
                  recipients: value
                }))}
                options={[
                  { value: 'admins', label: 'مدیران' },
                  { value: 'moderators', label: 'ناظران' },
                  { value: 'analysts', label: 'تحلیلگران' }
                ]}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button variant="primary" onClick={handleSave}>
              ذخیره زمانبندی
            </Button>
          </div>
        </div>
      </Card>

      {/* لیست زمانبندی‌ها */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">زمانبندی‌های فعال</h3>
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <ScheduleItem
                key={schedule.id}
                schedule={schedule}
                onDelete={() => handleDelete(schedule.id)}
                onToggle={() => handleToggle(schedule.id)}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

