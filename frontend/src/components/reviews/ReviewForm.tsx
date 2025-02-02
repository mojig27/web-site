// frontend/src/components/reviews/ReviewForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StarRating } from './StarRating';
import { ImageUpload } from '../common/ImageUpload';

interface ReviewFormProps {
  productId: string;
  onSubmit: (data: any) => Promise<void>;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleFormSubmit = async (data: any) => {
    await onSubmit({
      ...data,
      rating,
      images,
      productId
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">امتیاز شما</label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">نظر شما</label>
        <textarea
          {...register('comment', {
            required: 'لطفاً نظر خود را وارد کنید',
            minLength: {
              value: 10,
              message: 'نظر باید حداقل 10 حرف باشد'
            }
          })}
          className="w-full border rounded-lg p-3"
          rows={4}
        />
        {errors.comment && (
          <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">نقاط قوت</label>
          <textarea
            {...register('advantages')}
            className="w-full border rounded-lg p-3"
            rows={3}
            placeholder="هر مورد را در یک خط بنویسید"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">نقاط ضعف</label>
          <textarea
            {...register('disadvantages')}
            className="w-full border rounded-lg p-3"
            rows={3}
            placeholder="هر مورد را در یک خط بنویسید"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">تصاویر محصول</label>
        <ImageUpload
          images={images}
          onChange={setImages}
          maxImages={5}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
      >
        ثبت نظر
      </button>
    </form>
  );
};
