
// frontend/src/components/admin/discounts/DiscountForm.tsx
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { ProductSelect } from '@/components/admin/products/ProductSelect';
import { CategorySelect } from '@/components/admin/categories/CategorySelect';

interface DiscountFormProps {
  type: string;
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const DiscountForm: React.FC<DiscountFormProps> = ({
  type,
  initialData,
  onSubmit,
  onCancel
}) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: initialData || {
      code: '',
      title: '',
      type: 'percentage',
      value: '',
      minPurchase: '',
      maxDiscount: '',
      usageLimit: '',
      startDate: '',
      endDate: '',
      active: true,
      products: [],
      categories: []
    }
  });

  const discountType = watch('type');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          عنوان تخفیف
        </label>
        <input
          type="text"
          {...register('title', { required: 'عنوان تخفیف الزامی است' })}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {type === 'coupons' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            کد تخفیف
          </label>
          <input
            type="text"
            {...register('code', { required: 'کد تخفیف الزامی است' })}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
          {errors.code && (
            <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          نوع تخفیف
        </label>
        <select
          {...register('type')}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        >
          <option value="percentage">درصدی</option>
          <option value="fixed">مبلغ ثابت</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {discountType === 'percentage' ? 'درصد تخفیف' : 'مبلغ تخفیف'}
        </label>
        <input
          type="number"
          {...register('value', {
            required: 'مقدار تخفیف الزامی است',
            min: {
              value: 0,
              message: 'مقدار تخفیف نمی‌تواند منفی باشد'
            },
            max: {
              value: discountType === 'percentage' ? 100 : Infinity,
              message: 'درصد تخفیف نمی‌تواند بیشتر از 100 باشد'
            }
          })}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        />
        {errors.value && (
          <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            تاریخ شروع
          </label>
          <input
            type="datetime-local"
            {...register('startDate')}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            تاریخ پایان
          </label>
          <input
            type="datetime-local"
            {...register('endDate')}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            حداقل مبلغ خرید
          </label>
          <input
            type="number"
            {...register('minPurchase')}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            حداکثر مبلغ تخفیف
          </label>
          <input
            type="number"
            {...register('maxDiscount')}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </div>
      </div>

      {type === 'coupons' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            محدودیت استفاده
          </label>
          <input
            type="number"
            {...register('usageLimit')}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </div>
      )}

      {type === 'products' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            محصولات
          </label>
          <ProductSelect
            value={watch('products')}
            onChange={(products) => setValue('products', products)}
            multiple
          />
        </div>
      )}

      {type === 'categories' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            دسته‌بندی‌ها
          </label>
          <CategorySelect
            value={watch('categories')}
            onChange={(categories) => setValue('categories', categories)}
            multiple
          />
        </div>
      )}

      <div className="flex items-center">
        <input
          type="checkbox"
          {...register('active')}
          className="h-4 w-4 text-blue-600 rounded border-gray-300"
        />
        <label className="mr-2 block text-sm text-gray-700">
          فعال
        </label>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
        >
          انصراف
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {initialData ? 'ویرایش' : 'افزودن'} تخفیف
        </button>
      </div>
    </form>
  );
};