// frontend/src/components/content/ContentForm.tsx
import { useState, useRef } from 'react';
import { InputField } from '@/components/forms/InputField';
import { Button } from '@/components/ui/Button';
import { Editor } from '@/components/editor/Editor';
import { ImageUpload } from '@/components/forms/ImageUpload';
import { TagInput } from '@/components/forms/TagInput';

interface ContentFormProps {
  type: string;
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const ContentForm = ({
  type,
  initialData,
  onSubmit,
  onCancel
}: ContentFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    thumbnail: initialData?.thumbnail || '',
    status: initialData?.status || 'draft',
    tags: initialData?.tags || [],
    category: initialData?.category || '',
    meta: {
      title: initialData?.meta?.title || '',
      description: initialData?.meta?.description || '',
      keywords: initialData?.meta?.keywords || ''
    }
  });

  const [errors, setErrors] = useState<any>({});
  const editorRef = useRef<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleMetaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      meta: {
        ...prev.meta,
        [name]: value
      }
    }));
  };

  const handleEditorChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, thumbnail: url }));
  };

  const handleTagsChange = (tags: string[]) => {
    setFormData(prev => ({ ...prev, tags }));
  };

  const validate = () => {
    const newErrors: any = {};

    if (!formData.title) {
      newErrors.title = 'عنوان الزامی است';
    }

    if (!formData.content) {
      newErrors.content = 'محتوا الزامی است';
    }

    if (type === 'products' && !formData.price) {
      newErrors.price = 'قیمت الزامی است';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="col-span-2">
          <InputField
            label="عنوان"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            خلاصه
          </label>
          <textarea
            name="excerpt"
            rows={3}
            value={formData.excerpt}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            محتوا
          </label>
          <Editor
            ref={editorRef}
            initialValue={formData.content}
            onChange={handleEditorChange}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
        </div>

        <div>
          <ImageUpload
            label="تصویر شاخص"
            value={formData.thumbnail}
            onChange={handleImageUpload}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            وضعیت
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300"
          >
            <option value="draft">پیش‌نویس</option>
            <option value="published">انتشار</option>
            <option value="pending">در انتظار تایید</option>
          </select>
        </div>

        <div className="col-span-2">
          <TagInput
            label="برچسب‌ها"
            value={formData.tags}
            onChange={handleTagsChange}
          />
        </div>

        <div className="col-span-2">
          <h3 className="text-lg font-medium mb-4">تنظیمات SEO</h3>
          <div className="space-y-4">
            <InputField
              label="عنوان متا"
              name="title"
              value={formData.meta.title}
              onChange={handleMetaChange}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700">
                توضیحات متا
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.meta.description}
                onChange={handleMetaChange}
                className="mt-1 block w-full rounded-md border border-gray-300"
              />
            </div>
            <InputField
              label="کلمات کلیدی"
              name="keywords"
              value={formData.meta.keywords}
              onChange={handleMetaChange}
              placeholder="کلمات را با کاما جدا کنید"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="secondary" onClick={onCancel}>
          انصراف
        </Button>
        <Button type="submit">
          {initialData ? 'بروزرسانی' : 'ذخیره'}
        </Button>
      </div>
    </form>
  );
};