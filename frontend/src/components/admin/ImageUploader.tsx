// frontend/src/components/admin/ImageUploader.tsx
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (urls: string[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onImagesChange }) => {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setUploading(true);
      
      // اینجا می‌توانید از سرویس آپلود تصویر مورد نظر خود استفاده کنید
      // مثال: Cloudinary, AWS S3, یا API خودتان
      const uploadPromises = acceptedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('خطا در آپلود تصویر');
        }
        
        const data = await response.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onImagesChange([...images, ...uploadedUrls]);
      toast.success('تصاویر با موفقیت آپلود شدند');
    } catch (error) {
      console.error(error);
      toast.error('خطا در آپلود تصاویر');
    } finally {
      setUploading(false);
    }
  }, [images, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 5242880 // 5MB
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p className="text-gray-500">در حال آپلود تصاویر...</p>
        ) : isDragActive ? (
          <p className="text-blue-500">تصاویر را اینجا رها کنید</p>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-500">تصاویر را به اینجا بکشید یا کلیک کنید</p>
            <p className="text-sm text-gray-400">
              فرمت‌های مجاز: JPG, PNG, WebP - حداکثر حجم: 5MB
            </p>
          </div>
        )}
      </div>

      {/* نمایش تصاویر آپلود شده */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((url, index) => (
          <div key={url} className="relative group">
            <div className="relative h-32 rounded-lg overflow-hidden">
              <Image
                src={url}
                alt={`تصویر ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const newImages = images.filter(img => img !== url);
                onImagesChange(newImages);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full 
                flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};