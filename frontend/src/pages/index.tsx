// frontend/src/pages/index.tsx
import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import { Layout } from '@/components/common/Layout';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';

export default function Dashboard({ initialData }: any) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard');
      const newData = await response.json();
      setData(newData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <DashboardStats stats={data.stats} loading={loading} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity activities={data.activities} loading={loading} />
          <QuickActions onAction={fetchDashboardData} />
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Initial data fetching
  const initialData = {
    stats: {
      users: 0,
      posts: 0,
      orders: 0,
      revenue: 0
    },
    activities: []
  };

  return {
    props: {
      initialData
    }
  };
};