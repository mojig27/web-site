// frontend/src/components/admin/LiveMonitoring.tsx
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LineChart, GaugeChart } from '@/components/charts';
import { monitoringService } from '@/services/monitoring.service';

export const LiveMonitoring = () => {
  const [metrics, setMetrics] = useState({
    current: {
      qps: 0, // Queries Per Second
      accuracy: 0,
      latency: 0,
      queueSize: 0,
      errorRate: 0
    },
    history: [] as any[]
  });

  const [alerts, setAlerts] = useState<any[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    initializeWebSocket();
    return () => ws?.close();
  }, []);

  const initializeWebSocket = () => {
    const socket = new WebSocket(config.MONITORING_WS_URL);
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'metrics') {
        updateMetrics(data.metrics);
      } else if (data.type === 'alert') {
        addAlert(data.alert);
      }
    };

    setWs(socket);
  };

  const updateMetrics = (newMetrics: any) => {
    setMetrics(prev => ({
      current: newMetrics,
      history: [...prev.history.slice(-60), newMetrics]
    }));
  };

  const addAlert = (alert: any) => {
    setAlerts(prev => [alert, ...prev].slice(0, 10));
  };

  return (
    <div className="space-y-6">
      {/* نشانگرهای اصلی */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricGauge
          title="دقت تشخیص"
          value={metrics.current.accuracy}
          max={100}
          unit="%"
          threshold={90}
        />
        <MetricGauge
          title="زمان پاسخ"
          value={metrics.current.latency}
          max={1000}
          unit="ms"
          threshold={500}
          inverse
        />
        <MetricGauge
          title="درخواست در ثانیه"
          value={metrics.current.qps}
          max={100}
          unit="req/s"
          threshold={80}
          inverse
        />
        <MetricGauge
          title="نرخ خطا"
          value={metrics.current.errorRate}
          max={100}
          unit="%"
          threshold={5}
          inverse
        />
      </div>

      {/* نمودار روند */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">روند عملکرد</h3>
          <div className="h-64">
            <LineChart
              data={metrics.history}
              series={[
                { key: 'accuracy', label: 'دقت' },
                { key: 'latency', label: 'تاخیر' },
                { key: 'qps', label: 'درخواست/ثانیه' }
              ]}
            />
          </div>
        </div>
      </Card>

      {/* هشدارها */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">هشدارهای سیستم</h3>
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <AlertItem key={index} alert={alert} />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

