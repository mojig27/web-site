
// frontend/src/components/admin/shipping/ShipmentForm.tsx
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { AddressMap } from '@/components/common/AddressMap';

interface ShipmentFormProps {
  order: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const ShipmentForm: React.FC<ShipmentFormProps> = ({
  order,
  onSubmit,
  onCancel
}) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      shippingMethod: '',
      trackingNumber: '',
      estimatedDelivery: '',
      courier: '',
      notes: '',
      cost: 0,
      packages: [{ weight: 0, dimensions: { length: 0, width: 0, height: 0 } }]
    }
  });

  const [showMap, setShowMap] = useState(false);

  const addPackage = () => {
    const packages = watch('packages');
    setValue('packages', [
      ...packages,
      { weight: 0, dimensions: { length: 0, width: 0, height: 0 } }
    ]);
  };

  const removePackage = (index: number) => {
    const packages = watch('packages');
    packages.splice(index, 1);
    setValue('packages', packages);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">اطلاعات سفارش #{order.number}</h3>
        <div className="text-sm text-gray-600">
          <p>مشتری: {order.customer.name}</p>
          <p>مبلغ: {order.total} تومان</p>
          <p>تاریخ: {new Date(order.createdAt).toLocaleDateString('fa-IR')}</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          روش ارسال
        </label>
        <select
          {...register('shippingMethod', { required: 'روش ارسال الزامی است' })}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        >
          <option value="">انتخاب کنید</option>
          <option value="express">پست پیشتاز</option>
          <option value="normal">پست عادی</option>
          <option value="peyk">پیک موتوری</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          شرکت پستی
        </label>
        <select
          {...register('courier')}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        >
          <option value="">انتخاب کنید</option>
          <option value="post">پست ایران</option>
          <option value="tipax">تیپاکس</option>
          <option value="snapbox">اسنپ باکس</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          کد رهگیری
        </label>
        <input
          type="text"
          {...register('trackingNumber')}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          تاریخ تحویل تخمینی
        </label>
        <input
          type="date"
          {...register('estimatedDelivery')}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            بسته‌های ارسالی
          </label>
          <button
            type="button"
            onClick={addPackage}
            className="text-blue-600 hover:text-blue-700"
          >
            + افزودن بسته
          </button>
        </div>

        <div className="space-y-4">
          {watch('packages').map((_, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-sm font-medium">بسته {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removePackage(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  حذف
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700">
                    وزن (کیلوگرم)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register(`packages.${index}.weight`)}
                    className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">
                    ابعاد (سانتی‌متر)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      placeholder="طول"
                      {...register(`packages.${index}.dimensions.length`)}
                      className="border rounded-md shadow-sm p-2"
                    />
                    <input
                      type="number"
                      placeholder="عرض"
                      {...register(`packages.${index}.dimensions.width`)}
                      className="border rounded-md shadow-sm p-2"
                    />
                    <input
                      type="number"
                      placeholder="ارتفاع"
                      {...register(`packages.${index}.dimensions.height`)}
                      className="border rounded-md shadow-sm p-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          یادداشت‌ها
        </label>
        <textarea
          {...register('notes')}
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
          ثبت ارسال
        </button>
      </div>
    </form>
  );
};