
// frontend/src/components/admin/ChangeAlertSettings.tsx
export const ChangeAlertSettings = () => {
    const [thresholds, setThresholds] = useState({
      accuracy: {
        enabled: true,
        threshold: 5, // درصد تغییر
        period: 'day'
      },
      autoDecision: {
        enabled: true,
        threshold: 10,
        period: 'day'
      },
      errorRate: {
        enabled: true,
        threshold: 2,
        period: 'hour'
      }
    });
  
    const [notifications, setNotifications] = useState({
      email: true,
      slack: false,
      dashboard: true,
      telegram: false
    });
  
    const handleSave = async () => {
      try {
        await reportService.updateAlertSettings({
          thresholds,
          notifications
        });
        toast.success('تنظیمات با موفقیت ذخیره شد');
      } catch (error) {
        toast.error('خطا در ذخیره تنظیمات');
      }
    };
  
    return (
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">تنظیمات هشدار تغییرات</h3>
          
          <div className="space-y-6">
            {/* تنظیمات آستانه‌ها */}
            <div>
              <h4 className="font-medium mb-3">آستانه‌های هشدار</h4>
              {Object.entries(thresholds).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-4 mb-4">
                  <Switch
                    checked={value.enabled}
                    onChange={(checked) => setThresholds(prev => ({
                      ...prev,
                      [key]: { ...prev[key], enabled: checked }
                    }))}
                  />
                  <span>{getMetricLabel(key)}</span>
                  <input
                    type="number"
                    value={value.threshold}
                    onChange={(e) => setThresholds(prev => ({
                      ...prev,
                      [key]: { ...prev[key], threshold: Number(e.target.value) }
                    }))}
                    className="w-20 rounded border-gray-300"
                  />
                  <Select
                    value={value.period}
                    onChange={(period) => setThresholds(prev => ({
                      ...prev,
                      [key]: { ...prev[key], period }
                    }))}
                    options={[
                      { value: 'hour', label: 'ساعتی' },
                      { value: 'day', label: 'روزانه' },
                      { value: 'week', label: 'هفتگی' }
                    ]}
                  />
                </div>
              ))}
            </div>
  
            {/* تنظیمات نوتیفیکیشن */}
            <div>
              <h4 className="font-medium mb-3">کانال‌های اطلاع‌رسانی</h4>
              <div className="space-y-2">
                {Object.entries(notifications).map(([key, enabled]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch
                      checked={enabled}
                      onChange={(checked) => setNotifications(prev => ({
                        ...prev,
                        [key]: checked
                      }))}
                    />
                    <span>{getNotificationChannelLabel(key)}</span>
                  </div>
                ))}
              </div>
            </div>
  
            <Button
              variant="primary"
              onClick={handleSave}
            >
              ذخیره تنظیمات
            </Button>
          </div>
        </div>
      </Card>
    );
  };