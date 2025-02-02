// frontend/src/components/admin/promotions/PromotionForm.tsx
import { useForm } from 'react-hook-form';
import { ProductSelector } from '@/components/admin/products/ProductSelector';
import { CustomerGroupSelector } from '@/components/admin/customers/CustomerGroupSelector';

interface PromotionFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const PromotionForm: React.FC<PromotionFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: initialData || {
      name: '',
      type: 'percentage',
      value: 0,
      minPurchase: 0,
      maxDiscount: 0,
      startDate: '',
      endDate: '',
      products: [],
      customerGroups: [],
      conditions: [],
      usageLimit: 0,
      perCustomerLimit: 0,
      active: true
    }
  });

  const discountType = watch('type');
  const conditions = watch('conditions');

  const addCondition = () => {
    setValue('conditions', [
      ...conditions,
      { type: 'cart_total', operator: 'gte', value: 0 }
    ]);
  };

  const removeCondition = (index: number) => {
    const newConditions = [...conditions];
    newConditions.splice(index, 1);
    setValue('conditions', newConditions);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          نام تخفیف
        </label>
        <input
          type="text"
          {...register('name', { required: 'نام تخفیف الزامی است' })}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
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
            <option value="free_shipping">ارسال رایگان</option>
            <option value="buy_x_get_y">خرید X دریافت Y</option>
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
                message: 'مقدار باید بزرگتر از صفر باشد'
              },
              max: {
                value: discountType === 'percentage' ? 100 : 1000000000,
                message: discountType === 'percentage' ? 'درصد باید کمتر از 100 باشد' : 'مبلغ نامعتبر است'
              }
            })}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
          {errors.value && (
            <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            تاریخ شروع
          </label>
          <input
            type="datetime-local"
            {...register('startDate', { required: 'تاریخ شروع الزامی است' })}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            تاریخ پایان
          </label>
          <input
            type="datetime-local"
            {...register('endDate', { required: 'تاریخ پایان الزامی است' })}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          محصولات مشمول
        </label>
        <ProductSelector
          selected={watch('products')}
          onChange={(products) => setValue('products', products)}
          multiple
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          گروه‌های مشتریان
        </label>
        <CustomerGroupSelector
          selected={watch('customerGroups')}
          onChange={(groups) => setValue('customerGroups', groups)}
          multiple
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            شرایط اعمال تخفیف
          </label>
          <button
            type="button"
            onClick={addCondition}
            className="text-blue-600 hover:text-blue-700"
          >
            + افزودن شرط
          </button>
        </div>
        
        <div className="space-y-3">
          {conditions.map((condition: any, index: number) => (
            <div key={index} className="flex gap-2 items-center">
              <select
                {...register(`conditions.${index}.type`)}
                className="flex-1 border rounded-md shadow-sm p-2"
              >
                <option value="cart_total">جمع سبد خرید</option>
                <option value="product_quantity">تعداد محصول</option>
                <option value="first_purchase">اولین خرید</option>
                <option value="customer_group">گروه مشتری</option>
              </select>
              
              <select
                {...register(`conditions.${index}.operator`)}
                className="border rounded-md shadow-sm p-2"
              >
                <option value="gte">بزرگتر یا مساوی</option>
                <option value="lte">کوچکتر یا مساوی</option>
                <option value="eq">مساوی</option>
              </select>
              
              <input
                type="number"
                {...register(`conditions.${index}.value`)}
                className="w-32 border rounded-md shadow-sm p-2"
              />
              
              <button
                type="button"
                onClick={() => removeCondition(index)}
                className="text-red-600 hover:text-red-700"
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            محدودیت استفاده کل
          </label>
          <input
            type="number"
            {...register('usageLimit')}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            محدودیت استفاده هر مشتری
          </label>
          <input
            type="number"
            {...register('perCustomerLimit')}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </div>
      </div>

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
          {initialData ? 'ویرایش' : 'ایجاد'} تخفیف
        </button>
      </div>
    </form>
  );
};