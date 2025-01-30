import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
}

export const RealTimeAlert: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://${window.location.host}/ws/performance`);

    socket.onmessage = (event) => {
      const alert = JSON.parse(event.data);
      setAlerts(prev => [alert, ...prev].slice(0, 10));
      showNotification(alert);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        setWs(new WebSocket(`ws://${window.location.host}/ws/performance`));
      }, 5000);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const showNotification = (alert: Alert) => {
    toast[alert.severity](`${alert.title}: ${alert.message}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  return (
    <div className="fixed bottom-4 right-4 w-96">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded ${
                alert.severity === 'critical'
                  ? 'bg-red-100 text-red-800'
                  : alert.severity === 'warning'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              <div className="font-medium">{alert.title}</div>
              <div className="text-sm">{alert.message}</div>
              <div className="text-xs mt-1">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};