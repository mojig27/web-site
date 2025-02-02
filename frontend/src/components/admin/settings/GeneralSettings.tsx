// frontend/src/components/admin/settings/GeneralSettings.tsx
import { useForm } from 'react-hook-form';

interface GeneralSettingsProps {
  settings: any;
  onSave: (data: any) => Promise<void>;
  saving: boolean;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  settings,
  onSave,
  saving
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      storeName: settings.general.storeName,
      storeDescription: settings.general.storeDescription,
      email: settings.general.email,
      phone: settings.general.phone,
      address: settings.general.address,
      logo: settings.general.logo,
      currency: settings.general.currency,
      timezone: settings.general.timezone,
      maintenanceMode: settings.general.maintenanceMode
    }
  });

  const onSubmit = async (data: any) => {
    await onSave({
      general: data
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          تنظیمات عمومی فروشگاه
        </h3>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              نام فروشگاه
            </label>
            <input
              type="text"
              {...register('storeName', { required: 'نام فروشگاه الزامی است' })}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
            {errors.storeName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.storeName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              ایمیل
            </label>
            <input
              type="email"
              {...register('email', { 
                required: 'ایمیل الزامی است',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'ایمیل نامعتبر است'
                }
              })}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              تلفن
            </label>
            <input
              type="text"
              {...register('phone', { required: 'تلفن الزامی است' })}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              واحد پول
            </label>
            <select
              {...register('currency')}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            >
              <option value="IRR">ریال</option>
              <option value="TOMAN">تومان</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              آدرس
            </label>
            <textarea
              {...register('address')}
              rows={3}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              توضیحات فروشگاه
            </label>
            <textarea
              {...register('storeDescription')}
              rows={4}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
          </div>

          <div className="sm:col-span-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('maintenanceMode')}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <label className="mr-2 block text-sm text-gray-700">
                حالت تعمیر و نگهداری
              </label>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              در این حالت فروشگاه برای کاربران عادی قابل دسترس نخواهد بود
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className={`
            px-4 py-2 bg-blue-600 text-white rounded-md
            ${saving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}
          `}
        >
          {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
        </button>
      </div>
    </form>
  );
};