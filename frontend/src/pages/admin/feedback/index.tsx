// frontend/src/pages/admin/feedback/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { FeedbackList } from '@/components/admin/feedback/FeedbackList';
import { SurveyForm } from '@/components/admin/feedback/SurveyForm';
import { FeedbackAnalytics } from '@/components/admin/feedback/FeedbackAnalytics';
import { feedbackService } from '@/services/feedback.service';
import { Tabs } from '@/components/common/Tabs';

export default function AdminFeedback() {
  const [activeTab, setActiveTab] = useState('reviews');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSurvey, setEditingSurvey] = useState<any>(null);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    rating: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const tabs = [
    { id: 'reviews', label: 'نظرات و امتیازها' },
    { id: 'surveys', label: 'نظرسنجی‌ها' },
    { id: 'analytics', label: 'تحلیل بازخوردها' }
  ];

  useEffect(() => {
    fetchFeedback();
  }, [activeTab, filters]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await feedbackService.getFeedback({
        type: activeTab,
        ...filters
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSurvey = async (data: any) => {
    try {
      if (editingSurvey) {
        await feedbackService.updateSurvey(editingSurvey._id, data);
      } else {
        await feedbackService.createSurvey(data);
      }
      await fetchFeedback();
      setEditingSurvey(null);
    } catch (error) {
      console.error('Error saving survey:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-bold">مدیریت نظرات و نظرسنجی‌ها</h1>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="p-6">
          {/* فیلترها */}
          {activeTab === 'reviews' && (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="border rounded-lg p-2"
                >
                  <option value="all">همه نظرات</option>
                  <option value="product">نظرات محصول</option>
                  <option value="order">نظرات سفارش</option>
                  <option value="service">نظرات خدمات</option>
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="border rounded-lg p-2"
                >
                  <option value="all">همه وضعیت‌ها</option>
                  <option value="pending">در انتظار تایید</option>
                  <option value="approved">تایید شده</option>
                  <option value="rejected">رد شده</option>
                </select>

                <select
                  value={filters.rating}
                  onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                  className="border rounded-lg p-2"
                >
                  <option value="all">همه امتیازها</option>
                  <option value="5">5 ستاره</option>
                  <option value="4">4 ستاره</option>
                  <option value="3">3 ستاره</option>
                  <option value="2">2 ستاره</option>
                  <option value="1">1 ستاره</option>
                </select>

                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="border rounded-lg p-2"
                >
                  <option value="date">تاریخ</option>
                  <option value="rating">امتیاز</option>
                  <option value="likes">لایک‌ها</option>
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* فرم نظرسنجی یا آمار */}
            <div className="lg:col-span-1">
              {activeTab === 'surveys' ? (
                <SurveyForm
                  initialData={editingSurvey}
                  onSubmit={handleSaveSurvey}
                  onCancel={() => setEditingSurvey(null)}
                />
              ) : activeTab === 'analytics' ? (
                <FeedbackAnalytics data={items} />
              ) : null}
            </div>

            {/* لیست نظرات */}
            <div className="lg:col-span-2">
              <FeedbackList
                items={items}
                loading={loading}
                type={activeTab}
                onUpdateStatus={async (id, status) => {
                  await feedbackService.updateFeedbackStatus(id, status);
                  await fetchFeedback();
                }}
                onDelete={async (id) => {
                  if (window.confirm('آیا از حذف این مورد اطمینان دارید؟')) {
                    await feedbackService.deleteFeedback(id);
                    await fetchFeedback();
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}