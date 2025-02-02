// frontend/src/pages/admin/crm/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { CustomerList } from '@/components/admin/crm/CustomerList';
import { InteractionLog } from '@/components/admin/crm/InteractionLog';
import { CampaignManager } from '@/components/admin/crm/CampaignManager';
import { crmService } from '@/services/crm.service';

export default function AdminCRM() {
  const [activeTab, setActiveTab] = useState('customers');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    customers: [],
    interactions: [],
    campaigns: [],
    stats: {}
  });
  const [filters, setFilters] = useState({
    segment: 'all',
    status: 'all',
    source: 'all',
    search: ''
  });

  const tabs = [
    { id: 'customers', label: 'مشتریان' },
    { id: 'interactions', label: 'تعاملات' },
    { id: 'campaigns', label: 'کمپین‌ها' },
    { id: 'analytics', label: 'تحلیل‌ها' }
  ];

  useEffect(() => {
    fetchCRMData();
  }, [activeTab, filters]);

  const fetchCRMData = async () => {
    try {
      setLoading(true);
      const response = await crmService.getData({
        tab: activeTab,
        filters
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching CRM data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">مدیریت مشتریان و CRM</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                <span className="text-sm text-blue-800">
                  {data.stats?.totalCustomers || 0} مشتری فعال
                </span>
              </div>
              <button
                onClick={() => setSelectedCustomer({})}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                افزودن مشتری جدید
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
                <div className="flex items-center">
                  {tab.label}
                  {tab.id === 'interactions' && data.stats?.pendingInteractions > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      {data.stats.pendingInteractions}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* فیلترها */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="جستجوی مشتری..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="border rounded-lg p-2"
              />
              <select
                value={filters.segment}
                onChange={(e) => setFilters({ ...filters, segment: e.target.value })}
                className="border rounded-lg p-2"
              >
                <option value="all">همه بخش‌ها</option>
                <option value="vip">VIP</option>
                <option value="regular">عادی</option>
                <option value="inactive">غیرفعال</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="border rounded-lg p-2"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="active">فعال</option>
                <option value="pending">در انتظار</option>
                <option value="blocked">مسدود</option>
              </select>
              <select
                value={filters.source}
                onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                className="border rounded-lg p-2"
              >
                <option value="all">همه منابع</option>
                <option value="website">وبسایت</option>
                <option value="referral">معرفی</option>
                <option value="campaign">کمپین</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {activeTab === 'customers' && (
              <>
                {/* لیست مشتریان */}
                <div className="lg:col-span-2">
                  <CustomerList
                    customers={data.customers}
                    loading={loading}
                    onSelect={setSelectedCustomer}
                    onUpdateStatus={async (customerId, status) => {
                      await crmService.updateCustomerStatus(customerId, status);
                      await fetchCRMData();
                    }}
                  />
                </div>

                {/* جزئیات مشتری */}
                <div className="lg:col-span-1">
                  {selectedCustomer && (
                    <CustomerDetail
                      customer={selectedCustomer}
                      onSave={async (data) => {
                        if (data.id) {
                          await crmService.updateCustomer(data.id, data);
                        } else {
                          await crmService.createCustomer(data);
                        }
                        setSelectedCustomer(null);
                        await fetchCRMData();
                      }}
                      onCancel={() => setSelectedCustomer(null)}
                    />
                  )}
                </div>
              </>
            )}

            {activeTab === 'interactions' && (
              <InteractionLog
                interactions={data.interactions}
                customers={data.customers}
                onInteractionAdd={async (data) => {
                  await crmService.addInteraction(data);
                  await fetchCRMData();
                }}
                onInteractionUpdate={async (id, data) => {
                  await crmService.updateInteraction(id, data);
                  await fetchCRMData();
                }}
              />
            )}

            {activeTab === 'campaigns' && (
              <CampaignManager
                campaigns={data.campaigns}
                customers={data.customers}
                onCampaignCreate={async (data) => {
                  await crmService.createCampaign(data);
                  await fetchCRMData();
                }}
                onCampaignUpdate={async (id, data) => {
                  await crmService.updateCampaign(id, data);
                  await fetchCRMData();
                }}
              />
            )}

            {activeTab === 'analytics' && (
              <CRMAnalytics
                stats={data.stats}
                onDateRangeChange={async (range) => {
                  const response = await crmService.getAnalytics(range);
                  setData(prev => ({ ...prev, stats: response.data }));
                }}
              />
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}