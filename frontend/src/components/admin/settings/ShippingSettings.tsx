// frontend/src/components/admin/settings/ShippingSettings.tsx
import { useForm, useFieldArray } from 'react-hook-form';
import { Switch } from '@/components/common/Switch';

interface ShippingSettingsProps {
  settings: any;
  onSave: (data: any) => Promise<void>;
  saving: boolean;
}

export const ShippingSettings: React.FC<ShippingSettingsProps> = ({
  settings,
  onSave,
  saving
}) => {
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      shipping: {
        methods: settings.shipping?.methods || [],
        freeShippingThreshold: settings.shipping?.freeShippingThreshold || 0,
        enableFreeShipping: settings.shipping?.enableFreeShipping || false,
        provinces: settings.shipping?.provinces || [],
        restrictions: settings.shipping?.restrictions || {
          maxWeight: 0,
          maxDimensions: { length: 0, width: 0, height: 0 }
        }
      }
    }
  });

  const { fields: methodFields, append: appendMethod, remove: removeMethod } = 
    useFieldArray({
      control,
      name: "shipping.methods"
    });

  const { fields: provinceFields, append: appendProvince, remove: removeProvince } = 
    useFieldArray({
      control,
      name: "shipping.provinces"
    });

  const enableFreeShipping = watch("shipping.enableFreeShipping");

  const onSubmit = async (data: any) => {
    await onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* روش‌های ارسال */}
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          روش‌های ارسال
        </h3>
        <div className="space-y-4">
          {methodFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    عنوان روش ارسال
                  </label>
                  <input
                    type="text"
                    {...register(`shipping.methods.${index}.title`, {
                      required: 'عنوان روش ارسال الزامی است'
                    })}
                    className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  />
                  {errors.shipping?.methods?.[index]?.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.shipping.methods[index].title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    هزینه ارسال (تومان)
                  </label>
                  <input
                    type="number"
                    {...register(`shipping.methods.${index}.cost`, {
                      required: 'هزینه ارسال الزامی است',
                      min: {
                        value: 0,
                        message: 'هزینه ارسال نمی‌تواند منفی باشد'
                      }
                    })}
                    className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    زمان تقریبی ارسال (روز)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      {...register(`shipping.methods.${index}.estimatedDays.min`, {
                        required: true,
                        min: 0
                      })}
                      placeholder="حداقل"
                      className="mt-1 block w-full border rounded-md shadow-sm p-2"
                    />
                    <input
                      type="number"
                      {...register(`shipping.methods.${index}.estimatedDays.max`, {
                        required: true,
                        min: 0
                      })}
                      placeholder="حداکثر"
                      className="mt-1 block w-full border rounded-md shadow-sm p-2"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => removeMethod(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  حذف این روش ارسال
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => appendMethod({
              title: '',
              cost: 0,
              estimatedDays: { min: 1, max: 3 }
            })}
            className="text-blue-600 hover:text-blue-700"
          >
            + افزودن روش ارسال جدید
          </button>
        </div>
      </div>

      {/* ارسال رایگان */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            ارسال رایگان
          </h3>
          <Switch
            {...register('shipping.enableFreeShipping')}
            label="فعال‌سازی ارسال رایگان"
          />
        </div>

        {enableFreeShipping && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              حداقل مبلغ سفارش برای ارسال رایگان (تومان)
            </label>
            <input
              type="number"
              {...register('shipping.freeShippingThreshold', {
                required: 'این مقدار الزامی است',
                min: {
                  value: 0,
                  message: 'مقدار نمی‌تواند منفی باشد'
                }
              })}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
            {errors.shipping?.freeShippingThreshold && (
              <p className="mt-1 text-sm text-red-600">
                {errors.shipping.freeShippingThreshold.message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* محدودیت‌های ارسال */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          محدودیت‌های ارسال
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              حداکثر وزن مجاز (کیلوگرم)
            </label>
            <input
              type="number"
              {...register('shipping.restrictions.maxWeight')}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              حداکثر ابعاد مجاز (سانتی‌متر)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                {...register('shipping.restrictions.maxDimensions.length')}
                placeholder="طول"
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              />
              <input
                type="number"
                {...register('shipping.restrictions.maxDimensions.width')}
                placeholder="عرض"
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              />
              <input
                type="number"
                {...register('shipping.restrictions.maxDimensions.height')}
                placeholder="ارتفاع"
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* هزینه ارسال بر اساس استان */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          هزینه ارسال بر اساس استان
        </h3>
        <div className="space-y-4">
          {provinceFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    استان
                  </label>
                  <select
                    {...register(`shipping.provinces.${index}.name`)}
                    className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  >
                    <option value="">انتخاب استان</option>
                    {/* لیست استان‌ها */}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    هزینه اضافی (تومان)
                  </label>
                  <input
                    type="number"
                    {...register(`shipping.provinces.${index}.extraCost`)}
                    className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeProvince(index)}
                className="mt-2 text-red-600 hover:text-red-700"
              >
                حذف
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => appendProvince({ name: '', extraCost: 0 })}
            className="text-blue-600 hover:text-blue-700"
          >
            + افزودن استان
          </button>
        </div>
      </div>

      {/* دکمه ذخیره */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className={`
            px-4 py-2 bg-blue-600 text-white rounded-md
            ${saving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}
          `}
        >
          {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
        </button>
      </div>
    </form>
  );
};