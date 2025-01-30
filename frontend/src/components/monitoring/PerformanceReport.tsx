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

interface PerformanceReport {
  generatedAt: string;
  summary: {
    totalTests: number;
    passRate: number;
    avgResponseTime: number;
    criticalIssues: Array<{
      type: string;
      value: number;
      threshold: number;
    }>;
  };
  recommendations: string[];
  details: any[];
}

export const PerformanceReport: React.FC = () => {
  const [report, setReport] = useState<PerformanceReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestReport();
  }, []);

  const fetchLatestReport = async () => {
    try {
      const response = await fetch('/api/performance/latest-report');
      const data = await response.json();
      if (data.success) {
        setReport(data.report);
      }
    } catch (error) {
      console.error('Failed to fetch performance report:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading report...</div>;
  if (!report) return <div>No report available</div>;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Performance Report</h1>
        <p className="text-gray-600">Generated at: {new Date(report.generatedAt).toLocaleString()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Total Tests"
          value={report.summary.totalTests}
          type="number"
        />
        <MetricCard
          title="Pass Rate"
          value={report.summary.passRate}
          type="percentage"
        />
        <MetricCard
          title="Avg Response Time"
          value={report.summary.avgResponseTime}
          type="time"
        />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Response Time Trend</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={report.details}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="responseTime"
                stroke="#8884d8"
                name="Response Time"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Critical Issues</h2>
        <div className="bg-red-50 p-4 rounded-lg">
          {report.summary.criticalIssues.map((issue, index) => (
            <div key={index} className="mb-2">
              <span className="font-medium">{issue.type}:</span>
              <span className="text-red-600 ml-2">
                {issue.value} (Threshold: {issue.threshold})
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
        <ul className="list-disc pl-5">
          {report.recommendations.map((rec, index) => (
            <li key={index} className="mb-2 text-gray-700">{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: number;
  type: 'number' | 'percentage' | 'time';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, type }) => {
  const formatValue = () => {
    switch (type) {
      case 'percentage':
        return `${value.toFixed(2)}%`;
      case 'time':
        return `${value.toFixed(2)}ms`;
      default:
        return value.toString();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-600 mb-2">{title}</h3>
      <p className="text-3xl font-bold">{formatValue()}</p>
    </div>
  );
};