
// frontend/src/components/admin/cms/ContentForm.tsx
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Editor } from '@/components/common/Editor';
import { ImageUpload } from '@/components/common/ImageUpload';
import { SEOSection } from '@/components/admin/cms/SEOSection';

interface ContentFormProps {
  type: string;
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const ContentForm: React.FC<ContentFormProps> = ({
  type,
  initialData,
  onSubmit,
  onCancel
}) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: initialData || {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featuredImage: '',
      status: 'draft',
      template: 'default',
      categories: [],
      tags: [],
      seo: {
        title: '',
        description: '',
        keywords: '',
        ogImage: ''
      }
    }
  });

  const [showSEO, setShowSEO] = useState(false);

  useEffect(() => {
    // تبدیل عنوان به slug
    const subscription = watch((value, { name }) => {
      if (name === 'title') {
        setValue('slug', value.title?.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, '')
        );
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          نامک (Slug)
        </label>
        <input
          type="text"
          {...register('slug', { required: 'نامک الزامی است' })}
          className="mt-1 block w-full border rounded-md shadow-sm p-2"
        />
      </div>

      {type !== 'categories' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            محتوا
          </label>
          <Editor
            value={watch('content')}
            onChange={(value) => setValue('content', value)}
          />
        </div>
      )}

      {type === 'posts' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            خلاصه
          </label>
          <textarea
            {...register('excerpt')}
            rows={3}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          تصویر شاخص
        </label>
        <ImageUpload
          value={watch('featuredImage')}
          onChange={(url) => setValue('featuredImage', url)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            وضعیت
          </label>
          <select
            {...register('status')}
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          >
            <option value="draft">پیش‌نویس</option>
            <option value="published">منتشر شده</option>
          </select>
        </div>

        {type === 'pages' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              قالب
            </label>
            <select
              {...register('template')}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            >
              <option value="default">پیش‌فرض</option>
              <option value="full-width">تمام عرض</option>
              <option value="sidebar">دارای سایدبار</option>
            </select>
          </div>
        )}
      </div>

      {/* بخش SEO */}
      <div>
        <button
          type="button"
          onClick={() => setShowSEO(!showSEO)}
          className="text-blue-600 hover:text-blue-700"
        >
          {showSEO ? '- بستن' : '+ تنظیمات SEO'}
        </button>
        {showSEO && (
          <SEOSection
            register={register}
            watch={watch}
            setValue={setValue}
            errors={errors}
          />
        )}
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
          {initialData ? 'ویرایش' : 'افزودن'} محتوا
        </button>
      </div>
    </form>
  );
};