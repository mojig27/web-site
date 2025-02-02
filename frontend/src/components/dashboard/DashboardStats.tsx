// frontend/src/components/dashboard/DashboardStats.tsx
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { 
  UsersIcon, 
  DocumentIcon, 
  ShoppingCartIcon, 
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

interface StatsProps {
  stats: {
    users: number;
    posts: number;
    orders: number;
    revenue: number;
  };
  loading: boolean;
}

export const DashboardStats = ({ stats, loading }: StatsProps) => {
  const items = [
    {
      title: 'کاربران فعال',
      value: stats.users,
      icon: UsersIcon,
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'محتوای منتشر شده',
      value: stats.posts,
      icon: DocumentIcon,
      change: '+22%',
      trend: 'up'
    },
    {
      title: 'سفارشات',
      value: stats.orders,
      icon: ShoppingCartIcon,
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'درآمد',
      value: stats.revenue.toLocaleString(),
      icon: CurrencyDollarIcon,
      change: '+18%',
      trend: 'up'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            {loading ? (
              <Skeleton className="h-24" />
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{item.title}</p>
                  <p className="text-2xl font-semibold mt-2">{item.value}</p>
                  <p className={`text-sm mt-2 ${
                    item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.change}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
