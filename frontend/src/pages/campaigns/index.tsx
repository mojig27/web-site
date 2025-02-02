// frontend/src/pages/admin/campaigns/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { CampaignEditor } from '@/components/admin/campaigns/CampaignEditor';
import { CampaignList } from '@/components/admin/campaigns/CampaignList';
import { CampaignAnalytics } from '@/components/admin/campaigns/CampaignAnalytics';
import { campaignService } from '@/services/campaign.service';

export default function AdminCampaigns() {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    campaigns: [],
    analytics: {}
  });
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'active',
    platform: 'all',
    search: ''
  });

  const tabs = [
    { id: 'active', label: 'کمپین‌های فعال' },
    { id: 'scheduled', label: 'زمان‌بندی شده' },
    { id: 'completed', label: 'تکمیل شده' },
    { id: 'analytics', label: 'تحلیل عملکرد' }
  ];

  useEffect(() => {
    fetchCampaignData();
  }, [activeTab, filters]);

  const fetchCampaignData = async () => {
    try {
      setLoading(true);
      const response = await campaignService.getCampaigns({
        tab: activeTab,
        filters
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching campaign data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">مدیریت تبلیغات و کمپین‌ها</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedCampaign({})}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                ایجاد کمپین جدید
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
          {activeTab !== 'analytics' && (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="جستجو..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="border rounded-lg p-2"
                />
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="border rounded-lg p-2"
                >
                  <option value="all">همه انواع</option>
                  <option value="display">تبلیغات نمایشی</option>
                  <option value="email">ایمیل مارکتینگ</option>
                  <option value="social">شبکه‌های اجتماعی</option>
                  <option value="search">تبلیغات جستجو</option>
                </select>
                <select
                  value={filters.platform}
                  onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
                  className="border rounded-lg p-2"
                >
                  <option value="all">همه پلتفرم‌ها</option>
                  <option value="google">Google Ads</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="telegram">Telegram</option>
                </select>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="border rounded-lg p-2"
                >
                  <option value="all">همه وضعیت‌ها</option>
                  <option value="active">فعال</option>
                  <option value="paused">متوقف شده</option>
                  <option value="draft">پیش‌نویس</option>
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* لیست کمپین‌ها */}
            <div className="lg:col-span-2">
              {activeTab === 'analytics' ? (
                <CampaignAnalytics
                  data={data.analytics}
                  campaigns={data.campaigns}
                  onCampaignSelect={setSelectedCampaign}
                />
              ) : (
                <CampaignList
                  campaigns={data.campaigns}
                  loading={loading}
                  onSelect={setSelectedCampaign}
                  onStatusChange={async (id, status) => {
                    await campaignService.updateCampaignStatus(id, status);
                    await fetchCampaignData();
                  }}
                />
              )}
            </div>

            {/* فرم ویرایش کمپین */}
            <div className="lg:col-span-1">
              {selectedCampaign && (
                <CampaignEditor
                  campaign={selectedCampaign}
                  onSave={async (data) => {
                    if (data.id) {
                      await campaignService.updateCampaign(data.id, data);
                    } else {
                      await campaignService.createCampaign(data);
                    }
                    setSelectedCampaign(null);
                    await fetchCampaignData();
                  }}
                  onCancel={() => setSelectedCampaign(null)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
