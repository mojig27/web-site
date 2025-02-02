
// frontend/src/components/admin/customers/CustomerForm.tsx
import { useForm } from 'react-hook-form';

interface CustomerFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'customer',
      status: 'active',
      notes: '',
      newsletter: false
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          نام
        </label>
        <input
          type="text"
          {...register('firstName', { required: 'نام الزامی است' })}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        />
        {errors.firstName && (
          <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          نام خانوادگی
        </label>
        <input
          type="text"
          {...register('lastName', { required: 'نام خانوادگی الزامی است' })}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        />
        {errors.lastName && (
          <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
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
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          تلفن همراه
        </label>
        <input
          type="tel"
          {...register('phone', {
            pattern: {
              value: /^09\d{9}$/,
              message: 'شماره موبایل نامعتبر است'
            }
          })}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
          dir="ltr"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          نقش
        </label>
        <select
          {...register('role')}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        >
          <option value="customer">مشتری عادی</option>
          <option value="vip">مشتری ویژه</option>
          <option value="wholesale">عمده فروش</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          وضعیت
        </label>
        <select
          {...register('status')}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        >
          <option value="active">فعال</option>
          <option value="inactive">غیرفعال</option>
          <option value="blocked">مسدود شده</option>
        </select>
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

      <div className="flex items-center">
        <input
          type="checkbox"
          {...register('newsletter')}
          className="h-4 w-4 text-blue-600 rounded border-gray-300"
        />
        <label className="mr-2 block text-sm text-gray-700">
          عضویت در خبرنامه
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
          {initialData ? 'ویرایش' : 'افزودن'} مشتری
        </button>
      </div>
    </form>
  );
};