
// frontend/src/components/reviews/ReviewList.tsx
import { useState } from 'react';
import { Review } from '@/types';
import { StarRating } from './StarRating';
import { formatDate } from '@/utils/format';

interface ReviewListProps {
  reviews: Review[];
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  onLoadMore,
  hasMore
}) => {
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review._id} className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{review.user.name}</span>
                {review.buyerVerified && (
                  <span className="text-green-600 text-sm">خریدار محصول</span>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {formatDate(review.createdAt)}
              </div>
            </div>
            <StarRating value={review.rating} readonly size="sm" />
          </div>

          <p className="text-gray-800 mb-4">{review.comment}</p>

          {(review.advantages?.length > 0 || review.disadvantages?.length > 0) && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              {review.advantages?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-green-600 mb-2">نقاط قوت</h4>
                  <ul className="text-sm space-y-1">
                    {review.advantages.map((item, index) => (
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
                  <h4 className="text-sm font-medium text-red-600 mb-2">نقاط ضعف</h4>
                  <ul className="text-sm space-y-1">
                    {review.disadvantages.map((item, index) => (
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
            <div className="flex gap-2 mt-4">
              {review.images.map((image, index) => (
                <div key={index} className="relative w-20 h-20">
                  <img
                    src={image}
                    alt={`تصویر ${index + 1}`}
                    className="object-cover rounded"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {/* اضافه کردن لایک */}}
                className="text-gray-600 hover:text-blue-600"
              >
                <span>{review.likes}</span> پسندیدم
              </button>
              <button
                onClick={() => {/* گزارش نظر */}}
                className="text-gray-600 hover:text-red-600"
              >
                گزارش
              </button>
            </div>
          </div>
        </div>
      ))}

      {hasMore && (
        <div className="text-center">
          <button
            onClick={onLoadMore}
            className="text-blue-600 hover:text-blue-700"
          >
            مشاهده نظرات بیشتر
          </button>
        </div>
      )}
    </div>
  );
};