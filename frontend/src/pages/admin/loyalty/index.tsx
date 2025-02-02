// frontend/src/pages/admin/loyalty/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { RewardEditor } from '@/components/admin/loyalty/RewardEditor';
import { CustomerPoints } from '@/components/admin/loyalty/CustomerPoints';
import { LoyaltyRules } from '@/components/admin/loyalty/LoyaltyRules';
import { loyaltyService } from '@/services/loyalty.service';

export default function AdminLoyalty() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    rewards: [],
    customers: [],
    rules: [],
    stats: {}
  });
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    search: ''
  });

  const tabs = [
    { id: 'dashboard', label: 'داشبورد وفاداری' },
    { id: 'rewards', label: 'جوایز و پاداش‌ها' },
    { id: 'customers', label: 'امتیازات مشتریان' },
    { id: 'rules', label: 'قوانین و شرایط' }
  ];

  useEffect(() => {
    fetchLoyaltyData();
  }, [activeTab, filters]);

  const fetchLoyaltyData = async () => {
    try {
      setLoading(true);
      const response = await loyaltyService.getData({
        tab: activeTab,
        filters
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">مدیریت برنامه‌های وفاداری</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('rewards')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                افزودن جایزه جدید
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
          {activeTab === 'dashboard' && (
            <LoyaltyDashboard data={data.stats} />
          )}

          {activeTab === 'rewards' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* لیست جوایز */}
              <div className="lg:col-span-2">
                <div className="mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="جستجوی جایزه..."
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
                      <option value="product">محصولات</option>
                      <option value="discount">تخفیف‌ها</option>
                      <option value="service">خدمات</option>
                    </select>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="border rounded-lg p-2"
                    >
                      <option value="all">همه وضعیت‌ها</option>
                      <option value="active">فعال</option>
                      <option value="inactive">غیرفعال</option>
                      <option value="expired">منقضی شده</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white rounded-lg border">
                  {data.rewards.map((reward: any) => (
                    <div
                      key={reward.id}
                      className="p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedReward(reward)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{reward.title}</h3>
                          <p className="text-sm text-gray-500">{reward.description}</p>
                          <div className="mt-2 flex items-center gap-4 text-sm">
                            <span className="text-blue-600">{reward.points} امتیاز</span>
                            <span className={`
                              px-2 py-1 rounded-full text-xs
                              ${reward.status === 'active' ? 'bg-green-100 text-green-800' :
                                reward.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                                'bg-red-100 text-red-800'}
                            `}>
                              {reward.status === 'active' ? 'فعال' :
                               reward.status === 'inactive' ? 'غیرفعال' : 'منقضی شده'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReward(reward);
                            }}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            ویرایش
                          </button>
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (window.confirm('آیا از حذف این جایزه اطمینان دارید؟')) {
                                await loyaltyService.deleteReward(reward.id);
                                await fetchLoyaltyData();
                              }
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* فرم ویرایش جایزه */}
              <div className="lg:col-span-1">
                {selectedReward && (
                  <RewardEditor
                    reward={selectedReward}
                    onSave={async (data) => {
                      if (data.id) {
                        await loyaltyService.updateReward(data.id, data);
                      } else {
                        await loyaltyService.createReward(data);
                      }
                      setSelectedReward(null);
                      await fetchLoyaltyData();
                    }}
                    onCancel={() => setSelectedReward(null)}
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <CustomerPoints
              customers={data.customers}
              onPointsUpdate={async (customerId, points, type) => {
                await loyaltyService.updateCustomerPoints(customerId, points, type);
                await fetchLoyaltyData();
              }}
            />
          )}

          {activeTab === 'rules' && (
            <LoyaltyRules
              rules={data.rules}
              onSave={async (ruleData) => {
                await loyaltyService.updateRules(ruleData);
                await fetchLoyaltyData();
              }}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

