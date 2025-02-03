
// frontend/src/components/project/RiskManagement.tsx
export const RiskManagement: React.FC<{
    projectId: string;
  }> = ({ projectId }) => {
    const [risks, setRisks] = useState<any[]>([]);
    const [riskMatrix, setRiskMatrix] = useState<any>(null);
  
    useEffect(() => {
      fetchRiskAnalysis();
    }, [projectId]);
  
    const fetchRiskAnalysis = async () => {
      const [risksData, matrixData] = await Promise.all([
        projectService.getProjectRisks(projectId),
        projectService.getRiskMatrix(projectId)
      ]);
      setRisks(risksData);
      setRiskMatrix(matrixData);
    };
  
    return (
      <div className="space-y-6">
        {/* خلاصه ریسک‌ها */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <RiskSummaryCard
            title="ریسک کلی"
            value={calculateOverallRisk(risks)}
            status={getRiskStatus(risks)}
          />
          <RiskSummaryCard
            title="ریسک‌های بحرانی"
            value={countCriticalRisks(risks)}
            trend={getRiskTrend(risks, 'critical')}
          />
          <RiskSummaryCard
            title="ریسک‌های متوسط"
            value={countMediumRisks(risks)}
            trend={getRiskTrend(risks, 'medium')}
          />
          <RiskSummaryCard
            title="اقدامات پیشگیرانه"
            value={countPreventiveActions(risks)}
            status="info"
          />
        </div>
  
        {/* ماتریس ریسک */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">ماتریس ریسک</h3>
            <RiskMatrix
              data={riskMatrix}
              onCellClick={handleRiskCellClick}
            />
          </div>
        </Card>
  
        {/* لیست ریسک‌ها */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">لیست ریسک‌ها</h3>
            <div className="space-y-4">
              {risks.map(risk => (
                <RiskItem
                  key={risk.id}
                  risk={risk}
                  onStatusChange={handleRiskStatusChange}
                  onActionAdd={handleRiskActionAdd}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  };
  