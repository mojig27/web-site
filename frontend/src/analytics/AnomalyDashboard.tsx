import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface Anomaly {
  timestamp: string;
  anomaly_score: number;
  actual: number;
  typical: number;
}

export const AnomalyDashboard: React.FC = () => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnomalies();
  }, []);

  const fetchAnomalies = async () => {
    try {
      const response = await fetch('/api/ml/anomalies');
      const data = await response.json();
      if (data.success) {
        setAnomalies(data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch anomalies:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading anomaly data...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Anomaly Detection Dashboard</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <LineChart width={800} height={400} data={anomalies}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#8884d8"
            name="Actual"
          />
          <Line
            type="monotone"
            dataKey="typical"
            stroke="#82ca9d"
            name="Expected"
          />
          <Line
            type="monotone"
            dataKey="anomaly_score"
            stroke="#ff7300"
            name="Anomaly Score"
          />
        </LineChart>
      </div>
    </div>
  );
};