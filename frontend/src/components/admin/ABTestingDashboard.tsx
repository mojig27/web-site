// frontend/src/components/admin/ABTestingDashboard.tsx
export const ABTestingDashboard = () => {
    const [tests, setTests] = useState<any[]>([]);
    const [activeTest, setActiveTest] = useState<any>(null);
  
    useEffect(() => {
      fetchTests();
    }, []);
  
    const fetchTests = async () => {
      const response = await monitoringService.getABTests();
      setTests(response.data);
    };
  
    const createTest = async (config: any) => {
      await monitoringService.createABTest(config);
      fetchTests();
    };
  
    const stopTest = async (testId: string) => {
      await monitoringService.stopABTest(testId);
      fetchTests();
    };
  
    return (
      <div className="space-y-6">
        {/* کنترل تست */}
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">تست A/B تنظیمات</h3>
              <Button
                variant="primary"
                onClick={() => setActiveTest({})}
              >
                تست جدید
              </Button>
            </div>
  
            {/* فرم تست جدید */}
            {activeTest && (
              <ABTestForm
                test={activeTest}
                onSubmit={createTest}
                onCancel={() => setActiveTest(null)}
              />
            )}
          </div>
        </Card>
  
        {/* لیست تست‌های فعال */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">تست‌های فعال</h3>
            <div className="space-y-4">
              {tests.filter(t => t.status === 'active').map(test => (
                <ABTestCard
                  key={test.id}
                  test={test}
                  onStop={() => stopTest(test.id)}
                />
              ))}
            </div>
          </div>
        </Card>
  
        {/* نتایج تست‌های قبلی */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">تاریخچه تست‌ها</h3>
            <div className="space-y-4">
              {tests.filter(t => t.status === 'completed').map(test => (
                <ABTestResults key={test.id} test={test} />
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  };
  
  