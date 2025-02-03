// frontend/src/components/analytics/SmartAlerts.tsx
export const SmartAlerts: React.FC = () => {
    const [alerts, setAlerts] = useState<any[]>([]);
    const [alertRules, setAlertRules] = useState<any[]>([]);
  
    return (
      <div className="space-y-6">
        {/* تنظیمات هشدار */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">تنظیمات هشدار هوشمند</h3>
            <AlertRuleBuilder
              rules={alertRules}
              onChange={setAlertRules}
              onTest={handleTestRule}
            />
          </div>
        </Card>
  
        {/* هشدارهای فعال */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">هشدارهای فعال</h3>
            <ActiveAlerts
              alerts={alerts}
              onAcknowledge={handleAlertAcknowledge}
              onResolve={handleAlertResolve}
            />
          </div>
        </Card>
      </div>
    );
  };
  
  