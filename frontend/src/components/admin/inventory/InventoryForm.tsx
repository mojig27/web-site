// frontend/src/components/admin/inventory/InventoryForm.tsx
import { useForm } from 'react-hook-form';

interface InventoryFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const InventoryForm: React.FC<InventoryFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: initialData || {
      quantity: 0,
      lowStockThreshold: 5,
      type: 'adjustment',
      reason: '',
      note: ''
    }
  });

  const movementType = watch('type');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          نوع عملیات
        </label>
        <select
          {...register('type')}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        >
          <option value="adjustment">تنظیم موجودی</option>
          <option value="addition">افزایش موجودی</option>
          <option value="reduction">کاهش موجودی</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {movementType === 'adjustment' ? 'موجودی جدید' : 'تعداد'}
        </label>
        <input
          type="number"
          {...register('quantity', {
            required: 'این فیلد الزامی است',
            min: {
              value: 0,
              message: 'مقدار نمی‌تواند منفی باشد'
            }
          })}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        />
        {errors.quantity && (
          <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          حد هشدار موجودی کم
        </label>
        <input
          type="number"
          {...register('lowStockThreshold', {
            min: {
              value: 0,
              message: 'مقدار نمی‌تواند منفی باشد'
            }
          })}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          دلیل
        </label>
        <select
          {...register('reason')}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        >
          <option value="">انتخاب کنید</option>
          <option value="purchase">خرید</option>
          <option value="return">مرجوعی</option>
          <option value="damage">خرابی</option>
          <option value="inventory_check">شمارش انبار</option>
          <option value="other">سایر</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          توضیحات
        </label>
        <textarea
          {...register('note')}
          rows={3}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        />
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
          ثبت تغییرات
        </button>
      </div>
    </form>
  );
};