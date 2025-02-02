// frontend/src/components/admin/video/VideoUploader.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UploadProgress } from '@/components/common/UploadProgress';

interface VideoUploaderProps {
  onUpload: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  onUpload,
  onCancel
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      thumbnail: null,
      file: null,
      privacy: 'public',
      quality: '1080p'
    }
  });

  const handleUpload = async (data: any) => {
    try {
      setUploading(true);
      // شبیه‌سازی آپلود با پیشرفت
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      await onUpload(data);
    } catch (error) {
      console.error('Error uploading video:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-medium mb-4">آپلود ویدیو جدید</h3>
      
      {uploading ? (
        <div className="space-y-4">
          <UploadProgress progress={uploadProgress} />
          <p className="text-sm text-gray-500 text-center">
            لطفاً تا پایان آپلود صبر کنید...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(handleUpload)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              عنوان ویدیو
            </label>
            <input
              type="text"
              {...register('title', { required: true })}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              توضیحات
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                دسته‌بندی
              </label>
              <select
                {...register('category')}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              >
                <option value="">انتخاب کنید</option>
                <option value="education">آموزشی</option>
                <option value="entertainment">سرگرمی</option>
                <option value="news">خبری</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                حریم خصوصی
              </label>
              <select
                {...register('privacy')}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              >
                <option value="public">عمومی</option>
                <option value="private">خصوصی</option>
                <option value="unlisted">فهرست نشده</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              انتخاب فایل ویدیو
            </label>
            <input
              type="file"
              {...register('file', { required: true })}
              accept="video/*"
              className="mt-1 block w-full"
            />
            <p className="mt-1 text-sm text-gray-500">
              فرمت‌های مجاز: MP4, AVI, MOV - حداکثر سایز: 2GB
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              تصویر بندانگشتی
            </label>
            <input
              type="file"
              {...register('thumbnail')}
              accept="image/*"
              className="mt-1 block w-full"
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
              شروع آپلود
            </button>
          </div>
        </form>
      )}
    </div>
  );
};