// frontend/src/pages/admin/api-management/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { APIKeys } from '@/components/admin/api/APIKeys';
import { APIMetrics } from '@/components/admin/api/APIMetrics';
import { WebhookManager } from '@/components/admin/api/WebhookManager';
import { apiService } from '@/services/api.service';
import { toast } from '@/components/common/Toast';

export default function AdminAPIManagement() {
  const [activeTab, setActiveTab] = useState('endpoints');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    endpoints: [],
    webhooks: [],
    metrics: {}
  });
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    search: ''
  });

  const tabs = [
    { id: 'endpoints', label: 'مدیریت API' },
    { id: 'keys', label: 'کلیدهای دسترسی' },
    { id: 'webhooks', label: 'Webhook ها' },
    { id: 'monitoring', label: 'مانیتورینگ' }
  ];

  useEffect(() => {
    fetchAPIData();
  }, [activeTab, filters]);

  const fetchAPIData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getData({
        tab: activeTab,
        filters
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching API data:', error);
      toast.error('خطا در دریافت اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">مدیریت API و وب‌سرویس‌ها</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('keys')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                ایجاد کلید API جدید
              </button>
            </div>
          </div>
        </div>

        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* فیلترها */}
          {activeTab !== 'monitoring' && (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="جستجو..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="border rounded-lg p-2"
                />
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="border rounded-lg p-2"
                >
                  <option value="all">همه دسته‌ها</option>
                  <option value="public">عمومی</option>
                  <option value="private">خصوصی</option>
                  <option value="partner">همکاران</option>
                </select>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="border rounded-lg p-2"
                >
                  <option value="all">همه وضعیت‌ها</option>
                  <option value="active">فعال</option>
                  <option value="deprecated">منسوخ شده</option>
                  <option value="maintenance">در حال تعمیر</option>
                </select>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">در حال بارگذاری...</div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'endpoints' && (
                <EndpointManager
                  endpoints={data.endpoints}
                  onUpdate={async (id, data) => {
                    await apiService.updateEndpoint(id, data);
                    await fetchAPIData();
                  }}
                  onDelete={async (id) => {
                    if (window.confirm('آیا از حذف این endpoint اطمینان دارید؟')) {
                      await apiService.deleteEndpoint(id);
                      await fetchAPIData();
                    }
                  }}
                />
              )}

              {activeTab === 'keys' && (
                <APIKeys
                  keys={data.keys}
                  onGenerate={async (data) => {
                    const response = await apiService.generateKey(data);
                    await fetchAPIData();
                    return response.key;
                  }}
                  onRevoke={async (id) => {
                    if (window.confirm('آیا از لغو این کلید اطمینان دارید؟')) {
                      await apiService.revokeKey(id);
                      await fetchAPIData();
                    }
                  }}
                />
              )}

              {activeTab === 'webhooks' && (
                <WebhookManager
                  webhooks={data.webhooks}
                  onSave={async (data) => {
                    if (data.id) {
                      await apiService.updateWebhook(data.id, data);
                    } else {
                      await apiService.createWebhook(data);
                    }
                    await fetchAPIData();
                  }}
                  onDelete={async (id) => {
                    if (window.confirm('آیا از حذف این webhook اطمینان دارید؟')) {
                      await apiService.deleteWebhook(id);
                      await fetchAPIData();
                    }
                  }}
                />
              )}

              {activeTab === 'monitoring' && (
                <APIMetrics
                  metrics={data.metrics}
                  onTimeRangeChange={async (range) => {
                    const response = await apiService.getMetrics(range);
                    setData(prev => ({ ...prev, metrics: response.data }));
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
