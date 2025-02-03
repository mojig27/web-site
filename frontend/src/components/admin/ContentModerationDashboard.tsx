// frontend/src/components/admin/ContentModerationDashboard.tsx
export const ContentModerationDashboard = () => {
    const [stats, setStats] = useState({
      pendingReports: 0,
      todayReports: 0,
      totalReports: 0,
      spamCount: 0,
      toxicCount: 0
    });
    
    const [recentReports, setRecentReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      fetchData();
      const interval = setInterval(fetchData, 60000); // Refresh every minute
      return () => clearInterval(interval);
    }, []);
  
    const fetchData = async () => {
      try {
        const [statsData, reportsData] = await Promise.all([
          moderationService.getStats(),
          moderationService.getRecentReports()
        ]);
        setStats(statsData);
        setRecentReports(reportsData);
      } catch (error) {
        console.error('Error fetching moderation data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard
            title="گزارش‌های در انتظار"
            value={stats.pendingReports}
            trend={10}
            status="warning"
          />
          <StatCard
            title="گزارش‌های امروز"
            value={stats.todayReports}
            trend={-5}
            status="info"
          />
          <StatCard
            title="کل گزارش‌ها"
            value={stats.totalReports}
            status="default"
          />
          <StatCard
            title="محتوای اسپم"
            value={stats.spamCount}
            trend={15}
            status="error"
          />
          <StatCard
            title="محتوای نامناسب"
            value={stats.toxicCount}
            trend={8}
            status="error"
          />
        </div>
  
        {/* Reports Chart */}
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold">روند گزارش‌ها</h3>
            <ReportsChart data={stats.chartData} />
          </div>
        </Card>
  
        {/* Recent Reports */}
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">
              گزارش‌های اخیر
            </h3>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <ReportItem
                  key={report._id}
                  report={report}
                  onAction={handleReportAction}
                />
              ))}
            </div>
          </div>
        </Card>
  
        {/* Actions Log */}
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">
              فعالیت‌های اخیر
            </h3>
            <ActivityLog
              activities={activityLog}
              onRefresh={fetchActivityLog}
            />
          </div>
        </Card>
      </div>
    );
  };
  
  