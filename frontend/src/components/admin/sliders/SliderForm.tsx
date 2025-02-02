// frontend/src/components/admin/sliders/SliderForm.tsx
import { useForm } from 'react-hook-form';
import { ImageUpload } from '@/components/common/ImageUpload';

interface SliderFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const SliderForm: React.FC<SliderFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: initialData || {
      title: '',
      description: '',
      image: '',
      link: '',
      buttonText: '',
      active: true
    }
  });

  const imageUrl = watch('image');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          تصویر اسلایدر
        </label>
        <ImageUpload
          value={imageUrl}
          onChange={(url) => setValue('image', url)}
          aspectRatio={16/5}
        />
        {errors.image && (
          <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          عنوان
        </label>
        <input
          type="text"
          {...register('title', { required: 'عنوان الزامی است' })}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          توضیحات
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          لینک
        </label>
        <input
          type="text"
          {...register('link')}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          متن دکمه
        </label>
        <input
          type="text"
          {...register('buttonText')}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
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
          onClick={onCancel}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
        >
          انصراف
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {initialData ? 'ویرایش' : 'افزودن'} اسلایدر
        </button>
      </div>
    </form>
  );
};