// frontend/src/components/admin/notifications/TemplateForm.tsx
import { useForm } from 'react-hook-form';
import { Editor } from '@/components/common/Editor';
import { VariableSelector } from './VariableSelector';

interface TemplateFormProps {
  type: 'email' | 'sms';
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  onPreview: (data: any) => void;
}

export const TemplateForm: React.FC<TemplateFormProps> = ({
  type,
  initialData,
  onSubmit,
  onCancel,
  onPreview
}) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: initialData || {
      name: '',
      subject: '',
      content: '',
      event: '',
      active: true,
      variables: []
    }
  });

  const handleVariableSelect = (variable: string) => {
    const content = watch('content');
    setValue('content', content + `{{${variable}}}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          نام قالب
        </label>
        <input
          type="text"
          {...register('name', { required: 'نام قالب الزامی است' })}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          رویداد
        </label>
        <select
          {...register('event', { required: 'انتخاب رویداد الزامی است' })}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        >
          <option value="">انتخاب کنید</option>
          <option value="welcome">ثبت‌نام کاربر جدید</option>
          <option value="order_confirmation">تایید سفارش</option>
          <option value="order_shipped">ارسال سفارش</option>
          <option value="order_delivered">تحویل سفارش</option>
          <option value="password_reset">بازیابی رمز عبور</option>
          <option value="abandoned_cart">سبد خرید رها شده</option>
        </select>
        {errors.event && (
          <p className="mt-1 text-sm text-red-600">{errors.event.message}</p>
        )}
      </div>

      {type === 'email' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            موضوع
          </label>
          <input
            type="text"
            {...register('subject', { required: 'موضوع ایمیل الزامی است' })}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {type === 'email' ? 'محتوای ایمیل' : 'متن پیامک'}
        </label>
        {type === 'email' ? (
          <Editor
            value={watch('content')}
            onChange={(content) => setValue('content', content)}
          />
        ) : (
          <textarea
            {...register('content', { required: 'متن پیام الزامی است' })}
            rows={5}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        )}
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          متغیرها
        </label>
        <VariableSelector
          event={watch('event')}
          onSelect={handleVariableSelect}
        />
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
          onClick={() => onPreview(watch())}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
        >
          پیش‌نمایش
        </button>
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
          {initialData ? 'ویرایش' : 'ایجاد'} قالب
        </button>
      </div>
    </form>
  );
};