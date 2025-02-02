// frontend/src/pages/admin/promotions/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { PromotionForm } from '@/components/admin/promotions/PromotionForm';
import { PromotionList } from '@/components/admin/promotions/PromotionList';
import { PromotionAnalytics } from '@/components/admin/promotions/PromotionAnalytics';
import { promotionService } from '@/services/promotion.service';

export default function AdminPromotions() {
  const [activeTab, setActiveTab] = useState('active');
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  const tabs = [
    { id: 'active', label: 'تخفیف‌های فعال' },
    { id: 'scheduled', label: 'زمان‌بندی شده' },
    { id: 'expired', label: 'منقضی شده' },
    { id: 'analytics', label: 'تحلیل عملکرد' }
  ];

  useEffect(() => {
    fetchPromotions();
  }, [activeTab]);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await promotionService.getPromotions(activeTab);
      setPromotions(response.data);

      if (activeTab === 'analytics') {
        const analyticsData = await promotionService.getAnalytics();
        setAnalytics(analyticsData.data);
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editing) {
        await promotionService.updatePromotion(editing._id, data);
      } else {
        await promotionService.createPromotion(data);
      }
      await fetchPromotions();
      setEditing(null);
    } catch (error) {
      console.error('Error saving promotion:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-bold">مدیریت تخفیف‌های هوشمند</h1>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* فرم تخفیف */}
            <div className="lg:col-span-1">
              <PromotionForm
                initialData={editing}
                onSubmit={handleSave}
                onCancel={() => setEditing(null)}
              />
            </div>

            {/* لیست تخفیف‌ها یا تحلیل‌ها */}
            <div className="lg:col-span-2">
              {activeTab === 'analytics' ? (
                <PromotionAnalytics data={analytics} />
              ) : (
                <PromotionList
                  promotions={promotions}
                  loading={loading}
                  type={activeTab}
                  onEdit={setEditing}
                  onDelete={async (id) => {
                    if (window.confirm('آیا از حذف این تخفیف اطمینان دارید؟')) {
                      await promotionService.deletePromotion(id);
                      await fetchPromotions();
                    }
                  }}
                  onStatusChange={async (id, status) => {
                    await promotionService.updatePromotionStatus(id, status);
                    await fetchPromotions();
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

