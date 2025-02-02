// frontend/src/pages/admin/reviews/[id].tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { AdminLayout } from '@/components/admin/layout';
import { StarRating } from '@/components/reviews/StarRating';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { reviewService } from '@/services/review.service';
import { formatDate } from '@/utils/format';

export default function AdminReviewDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updateStatus, setUpdateStatus] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    if (id) {
      fetchReviewDetails();
    }
  }, [id]);

  const fetchReviewDetails = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getAdminReviewDetails(id as string);
      setReview(response.data);
      setUpdateStatus(response.data.status);
    } catch (error) {
      console.error('Error fetching review details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await reviewService.updateReviewStatus(review._id, {
        status: updateStatus,
        rejectReason: updateStatus === 'rejected' ? rejectReason : undefined
      });
      router.push('/admin/reviews');
    } catch (error) {
      console.error('Error updating review status:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('آیا از حذف این نظر اطمینان دارید؟')) {
      try {
        await reviewService.deleteReview(review._id);
        router.push('/admin/reviews');
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div>در حال بارگذاری...</div>
      </AdminLayout>
    );
  }

  if (!review) {
    return (
      <AdminLayout>
        <div>نظر یافت نشد</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* هدر صفحه */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">جزئیات نظر</h1>
              <p className="text-gray-600">
                ثبت شده در {formatDate(review.createdAt)}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                بازگشت
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                حذف نظر
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">وضعیت</div>
              <StatusBadge type="review" status={review.status} />
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">امتیاز</div>
              <StarRating value={review.rating} readonly />
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">تعداد لایک</div>
              <div className="font-semibold mt-1">{review.likes}</div>
            </div>
          </div>
        </div>

        {/* اطلاعات محصول و کاربر */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">اطلاعات محصول</h2>
            <div className="flex gap-4">
              <div className="relative w-24 h-24">
                <Image
                  src={review.product.images[0]}
                  alt={review.product.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div>
                <h3 className="font-semibold">{review.product.title}</h3>
                <p className="text-gray-600 mt-1">
                  دسته‌بندی: {review.product.category}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">اطلاعات کاربر</h2>
            <div>
              <div className="font-semibold">{review.user.name}</div>
              {review.buyerVerified && (
                <div className="text-green-600 text-sm mt-1">
                  خریدار محصول
                </div>
              )}
              {review.order && (
                <div className="text-sm text-gray-600 mt-2">
                  شماره سفارش: {review.order.slice(-8)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* متن نظر */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">متن نظر</h2>
          <p className="text-gray-800 mb-6">{review.comment}</p>

          {(review.advantages?.length > 0 || review.disadvantages?.length > 0) && (
            <div className="grid grid-cols-2 gap-4">
              {review.advantages?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-green-600 mb-2">
                    نقاط قوت
                  </h3>
                  <ul className="text-sm space-y-1">
                    {review.advantages.map((item: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-green-500">+</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {review.disadvantages?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-red-600 mb-2">
                    نقاط ضعف
                  </h3>
                  <ul className="text-sm space-y-1">
                    {review.disadvantages.map((item: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-red-500">-</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {review.images?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">تصاویر</h3>
              <div className="flex gap-4">
                {review.images.map((image: string, index: number) => (
                  <div key={index} className="relative w-32 h-32">
                    <Image
                      src={image}
                      alt={`تصویر ${index + 1}`}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* بخش تغییر وضعیت */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">تغییر وضعیت</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                وضعیت جدید
              </label>
              <select
                value={updateStatus}
                onChange={(e) => setUpdateStatus(e.target.value)}
                className="w-full border rounded-lg p-2"
              >
                <option value="pending">در انتظار تایید</option>
                <option value="approved">تایید شده</option>
                <option value="rejected">رد شده</option>
              </select>
            </div>

            {updateStatus === 'rejected' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  دلیل رد نظر
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full border rounded-lg p-2"
                  rows={3}
                  placeholder="دلیل رد نظر را وارد کنید..."
                />
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                ذخیره تغییرات
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}