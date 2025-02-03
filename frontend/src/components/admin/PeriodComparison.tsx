// frontend/src/components/admin/PeriodComparison.tsx
export const PeriodComparison = () => {
    const [periods, setPeriods] = useState({
      period1: {
        start: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        end: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      period2: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date()
      }
    });
  
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(false);
  
    const fetchComparison = async () => {
      setLoading(true);
      try {
        const data = await reportService.comparePerformance(periods);
        setMetrics(data);
      } catch (error) {
        toast.error('خطا در دریافت اطلاعات');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="space-y-6">
        {/* انتخاب دوره‌ها */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">مقایسه دوره‌ها</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">دوره اول</label>
                <DateRangePicker
                  value={periods.period1}
                  onChange={(range) => setPeriods(prev => ({
                    ...prev,
                    period1: range
                  }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">دوره دوم</label>
                <DateRangePicker
                  value={periods.period2}
                  onChange={(range) => setPeriods(prev => ({
                    ...prev,
                    period2: range
                  }))}
                />
              </div>
            </div>
            <div className="mt-4">
              <Button
                variant="primary"
                onClick={fetchComparison}
                loading={loading}
              >
                مقایسه دوره‌ها
              </Button>
            </div>
          </div>
        </Card>
  
        {metrics && (
          <>
            {/* مقایسه شاخص‌های کلیدی */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">مقایسه شاخص‌های کلیدی</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(metrics.kpis).map(([key, value]: [string, any]) => (
                    <ComparisonMetric
                      key={key}
                      label={getMetricLabel(key)}
                      value1={value.period1}
                      value2={value.period2}
                      unit={getMetricUnit(key)}
                      change={value.change}
                    />
                  ))}
                </div>
              </div>
            </Card>
  
            {/* نمودارهای مقایسه‌ای */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">مقایسه دقت تشخیص</h3>
                  <ComparisonChart
                    data={metrics.accuracyComparison}
                    period1Label="دوره اول"
                    period2Label="دوره دوم"
                  />
                </div>
              </Card>
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">مقایسه توزیع تصمیمات</h3>
                  <DecisionComparisonChart data={metrics.decisionsComparison} />
                </div>
              </Card>
            </div>
  
            {/* تحلیل تغییرات */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">تحلیل تغییرات</h3>
                <div className="space-y-4">
                  {metrics.changes.map((change: any, index: number) => (
                    <ChangeAnalysisItem
                      key={index}
                      change={change}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    );
  };