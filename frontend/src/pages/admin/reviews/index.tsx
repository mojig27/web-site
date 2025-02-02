// frontend/src/pages/admin/reviews/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { DataTable } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { reviewService } from '@/services/review.service';
import { formatDate } from '@/utils/format';
import { StarRating } from '@/components/reviews/StarRating';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    rating: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  const columns = [
    {
      title: 'محصول',
      key: 'product',
      render: (review) => (
        <div className="flex items-center">
          <img
            src={review.product.images[0]}
            alt={review.product.title}
            className="w-12 h-12 object-cover rounded ml-2"
          />
          <span>{review.product.title}</span>
        </div>
      )
    },
    {
      title: 'کاربر',
      key: 'user',
      render: (review) => (
        <div>
          <div>{review.user.name}</div>
          <div className="text-sm text-gray-500">
            {review.buyerVerified ? 'خریدار محصول' : 'کاربر عادی'}
          </div>
        </div>
      )
    },
    {
      title: 'امتیاز',
      key: 'rating',
      render: (review) => (
        <StarRating value={review.rating} readonly size="sm" />
      )
    },
    {
      title: 'وضعیت',
      key: 'status',
      render: (review) => (
        <StatusBadge
          type="review"
          status={review.status}
          onClick={() => handleStatusChange(review._id)}
        />
      )
    },
    {
      title: 'تاریخ',
      key: 'createdAt',
      render: (review) => formatDate(review.createdAt)
    },
    {
      title: 'عملیات',
      key: 'actions',
      render: (review) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewDetails(review._id)}
            className="text-blue-600 hover:text-blue-700"
          >
            مشاهده
          </button>
          <button
            onClick={() => handleDelete(review._id)}
            className="text-red-600 hover:text-red-700"
          >
            حذف
          </button>
        </div>
      )
    }
  ];

  useEffect(() => {
    fetchReviews();
  }, [pagination.page, filters]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getAdminReviews({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });
      setReviews(response.data.reviews);
      setPagination(prev => ({
        ...prev,
        total: response.data.total
      }));
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">مدیریت نظرات</h1>
          
          <ReviewFilters
            filters={filters}
            onChange={setFilters}
          />
        </div>

        <DataTable
          columns={columns}
          data={reviews}
          loading={loading}
          pagination={{
            current: pagination.page,
            total: pagination.total,
            pageSize: pagination.limit,
            onChange: (page) => setPagination(prev => ({ ...prev, page }))
          }}
        />
      </div>
    </AdminLayout>
  );
}

// frontend/src/components/admin/reviews/ReviewFilters.tsx
interface ReviewFiltersProps {
  filters: {
    status: string;
    rating: string;
    search: string;
  };
  onChange: (filters: any) => void;
}

export const ReviewFilters: React.FC<ReviewFiltersProps> = ({ filters, onChange }) => {
  const handleChange = (field: string, value: string) => {
    onChange({ ...filters, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          وضعیت
        </label>
        <select
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="w-full border rounded-lg p-2"
        >
          <option value="">همه</option>
          <option value="pending">در انتظار تایید</option>
          <option value="approved">تایید شده</option>
          <option value="rejected">رد شده</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          امتیاز
        </label>
        <select
          value={filters.rating}
          onChange={(e) => handleChange('rating', e.target.value)}
          className="w-full border rounded-lg p-2"
        >
          <option value="">همه</option>
          <option value="5">5 ستاره</option>
          <option value="4">4 ستاره</option>
          <option value="3">3 ستاره</option>
          <option value="2">2 ستاره</option>
          <option value="1">1 ستاره</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          جستجو
        </label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          placeholder="نام محصول یا کاربر..."
          className="w-full border rounded-lg p-2"
        />
      </div>
    </div>
  );
};