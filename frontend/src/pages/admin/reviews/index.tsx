// frontend/src/pages/admin/reviews/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { ReviewList } from '@/components/admin/reviews/ReviewList';
import { ReviewAnalytics } from '@/components/admin/reviews/ReviewAnalytics';
import { SentimentAnalysis } from '@/components/admin/reviews/SentimentAnalysis';
import { reviewService } from '@/services/review.service';

export default function AdminReviews() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    reviews: [],
    stats: {},
    sentiment: {}
  });
  const [filters, setFilters] = useState({
    status: 'all',
    rating: 'all',
    product: 'all',
    dateRange: 'all',
    search: ''
  });

  const tabs = [
    { id: 'all', label: 'همه نظرات' },
    { id: 'pending', label: 'در انتظار تایید' },
    { id: 'reported', label: 'گزارش شده' },
    { id: 'analytics', label: 'تحلیل‌ها' }
  ];

  useEffect(() => {
    fetchReviewData();
  }, [activeTab, filters]);

  const fetchReviewData = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getData({
        tab: activeTab,
        filters
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching review data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reviewId: string, status: string) => {
    try {
      await reviewService.updateReviewStatus(reviewId, status);
      await fetchReviewData();
    } catch (error) {
      console.error('Error updating review status:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">مدیریت نظرات و بررسی‌ها</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                <span className="text-sm text-blue-800">
                  میانگین امتیاز: {data.stats?.averageRating?.toFixed(1) || 0}/5
                </span>
              </div>
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
                  {tab.id === 'pending' && data.stats?.pendingCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      {data.stats.pendingCount}
                    </span>
                  )}
                  {tab.id === 'reported' && data.stats?.reportedCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                      {data.stats.reportedCount}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab !== 'analytics' && (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <input
                  type="text"
                  placeholder="جستجو در نظرات..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="border rounded-lg p-2"
                />
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="border rounded-lg p-2"
                >
                  <option value="all">همه وضعیت‌ها</option>
                  <option value="pending">در انتظار تایید</option>
                  <option value="approved">تایید شده</option>
                  <option value="rejected">رد شده</option>
                  <option value="reported">گزارش شده</option>
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
                  value={filters.product}
                  onChange={(e) => setFilters({ ...filters, product: e.target.value })}
                  className="border rounded-lg p-2"
                >
                  <option value="all">همه محصولات</option>
                  {data.products?.map((product: any) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                  className="border rounded-lg p-2"
                >
                  <option value="all">همه زمان‌ها</option>
                  <option value="today">امروز</option>
                  <option value="week">این هفته</option>
                  <option value="month">این ماه</option>
                  <option value="year">امسال</option>
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {activeTab !== 'analytics' ? (
              <>
                {/* لیست نظرات */}
                <div className="lg:col-span-2">
                  <ReviewList
                    reviews={data.reviews}
                    loading={loading}
                    onStatusChange={handleStatusChange}
                    onSelect={setSelectedReview}
                    selectedId={selectedReview?.id}
                  />
                </div>

                {/* جزئیات نظر */}
                <div className="lg:col-span-1">
                  {selectedReview ? (
                    <ReviewDetail
                      review={selectedReview}
                      onReply={async (reviewId, reply) => {
                        await reviewService.replyToReview(reviewId, reply);
                        await fetchReviewData();
                      }}
                      onStatusChange={handleStatusChange}
                      onClose={() => setSelectedReview(null)}
                    />
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      یک نظر را برای مشاهده جزئیات انتخاب کنید
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* تحلیل‌های نظرات */}
                <div className="lg:col-span-2">
                  <ReviewAnalytics stats={data.stats} />
                </div>

                {/* تحلیل احساسات */}
                <div className="lg:col-span-1">
                  <SentimentAnalysis sentiment={data.sentiment} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}