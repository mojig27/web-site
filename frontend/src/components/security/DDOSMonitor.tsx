import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { io, Socket } from 'socket.io-client';

interface DDOSMetrics {
  timestamp: number;
  totalRequests: number;
  bannedIPs: number;
  activeConnections: number;
  requestRate: number;
  suspiciousActivities: number;
}

interface Alert {
  id: string;
  type: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: number;
}

export const DDOSMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<DDOSMetrics[]>([]);
  const [realtimeMetrics, setRealtimeMetrics] = useState<DDOSMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h'>('1h');

  useEffect(() => {
    // WebSocket connection setup
    const newSocket = io('/security');
    
    newSocket.on('metrics', (data: DDOSMetrics) => {
      setRealtimeMetrics(data);
      setMetrics(prev => [...prev.slice(-100), data]);
    });

    newSocket.on('alert', (alert: Alert) => {
      setAlerts(prev => [alert, ...prev.slice(0, 49)]);
      
      // Show notification for critical alerts
      if (alert.severity === 'critical') {
        showNotification(alert);
      }
    });

    setSocket(newSocket);

    // Fetch historical data
    fetchHistoricalData();

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const fetchHistoricalData = async () => {
    try {
      const response = await fetch(`/api/security/ddos/history?duration=${timeRange}`);
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch historical data:', error);
    }
  };

  const showNotification = (alert: Alert) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('DDOS Alert', {
        body: alert.message,
        icon: '/security-alert.png'
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">DDOS Monitoring Dashboard</h1>

      {/* Real-time Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Request Rate"
          value={realtimeMetrics?.requestRate || 0}
          unit="/min"
          threshold={10000}
          type="speed"
        />
        <MetricCard
          title="Banned IPs"
          value={realtimeMetrics?.bannedIPs || 0}
          threshold={1000}
          type="count"
        />
        <MetricCard
          title="Active Connections"
          value={realtimeMetrics?.activeConnections || 0}
          threshold={5000}
          type="count"
        />
      </div>

      {/* Time Range Selector */}
      <div className="mb-6">
        <select
          value={timeRange}
          onChange={(e) => {
            setTimeRange(e.target.value as '1h' | '6h' | '24h');
            fetchHistoricalData();
          }}
          className="px-4 py-2 border rounded"
        >
          <option value="1h">Last Hour</option>
          <option value="6h">Last 6 Hours</option>
          <option value="24h">Last 24 Hours</option>
        </select>
      </div>

      {/* Metrics Charts */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Request Rate Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="requestRate"
                  stroke="#8884d8"
                  name="Requests/min"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Security Metrics</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="bannedIPs"
                  stroke="#ff0000"
                  name="Banned IPs"
                />
                <Line
                  type="monotone"
                  dataKey="suspiciousActivities"
                  stroke="#ffa500"
                  name="Suspicious Activities"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: number;
  unit?: string;
  threshold: number;
  type: 'speed' | 'count';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  threshold,
  type
}) => {
  const isWarning = value > threshold * 0.7;
  const isCritical = value > threshold;

  return (
    <div
      className={`p-6 rounded-lg shadow ${
        isCritical
          ? 'bg-red-100'
          : isWarning
          ? 'bg-yellow-100'
          : 'bg-green-100'
      }`}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold">
        {value.toLocaleString()}
        {unit && <span className="text-base ml-1">{unit}</span>}
      </p>
      <p className="text-sm mt-2">
        Threshold: {threshold.toLocaleString()}
        {unit && unit}
      </p>
    </div>
  );
};

interface AlertCardProps {
  alert: Alert;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  return (
    <div
      className={`p-4 rounded ${
        alert.severity === 'critical'
          ? 'bg-red-100 text-red-800'
          : alert.severity === 'warning'
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-blue-100 text-blue-800'
      }`}
    >
      <div className="font-medium">{alert.type}</div>
      <div className="text-sm">{alert.message}</div>
      <div className="text-xs mt-1">
        {new Date(alert.timestamp).toLocaleString()}
      </div>
    </div>
  );
};