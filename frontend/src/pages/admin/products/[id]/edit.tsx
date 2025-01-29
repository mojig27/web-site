// frontend/src/pages/admin/products/[id]/edit.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api/client';
import { ProductCategories } from '@/constants/categories';

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  specifications: {
    material: string;
    dimensions: string;
    colors: string[];
    warranty: string;
    madeIn: string;
  };
  stock: number;
  images: string[];
  installationGuide?: string;
}

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const isEditMode = id !== 'new';
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProductFormData>();

  useEffect(() => {
    if (isEditMode) {
      // دریافت اطلاعات محصول برای ویرایش
      api.get(`/products/${id}`).then(response => {
        const product = response.data;
        Object.keys(product).forEach(key => {
          setValue(key as keyof ProductFormData, product[key]);
        });
      });
    }
  }, [id, isEditMode, setValue]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      setLoading(true);
      if (isEditMode) {
        await api.put(`/products/${id}`, data);
        toast.success('محصول با موفقیت به‌روزرسانی شد');
      } else {
        await api.post('/products', data);
        toast.success('محصول جدید با موفقیت اضافه شد');
      }
      router.push('/admin/products');
    } catch (error) {
      toast.error('خطا در ذخیره‌سازی محصول');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'ویرایش محصول' : 'افزودن محصول جدید'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* اطلاعات اصلی محصول */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1">نام محصول</label>
              <input
                {...register('title', { required: 'نام محصول الزامی است' })}
                className="w-full p-2 border rounded"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-1">برند</label>
              <input
                {...register('brand', { required: 'برند الزامی است' })}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1">دسته‌بندی</label>
              <select
                {...register('category', { required: 'دسته‌بندی الزامی است' })}
                className="w-full p-2 border rounded"
              >
                <option value="">انتخاب دسته‌بندی</option>
                {Object.entries(ProductCategories).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">قیمت (تومان)</label>
              <input
                type="number"
                {...register('price', {
                  required: 'قیمت الزامی است',
                  min: { value: 0, message: 'قیمت نمی‌تواند منفی باشد' }
                })}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1">موجودی</label>
              <input
                type="number"
                {...register('stock', {
                  required: 'موجودی الزامی است',
                  min: { value: 0, message: 'موجودی نمی‌تواند منفی باشد' }
                })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* مشخصات فنی */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1">جنس</label>
              <input
                {...register('specifications.material')}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1">ابعاد</label>
              <input
                {...register('specifications.dimensions')}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1">گارانتی
              <input
                {...register('specifications.warranty')}
                className="w-full p-2 border rounded"
                placeholder="مثال: 24 ماه گارانتی"
              />
            </div>

            <div>
              <label className="block mb-1">کشور سازنده</label>
              <input
                {...register('specifications.madeIn')}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1">رنگ‌های موجود</label>
              <div className="flex flex-wrap gap-2">
                {watch('specifications.colors', []).map((color, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                    <span>{color}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const colors = watch('specifications.colors');
                        colors.splice(index, 1);
                        setValue('specifications.colors', [...colors]);
                      }}
                      className="text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const colors = watch('specifications.colors', []);
                    setValue('specifications.colors', [...colors, '']);
                  }}
                  className="px-3 py-1 border rounded hover:bg-gray-50"
                >
                  + افزودن رنگ
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* آپلود تصاویر */}
        <div className="space-y-4">
          <label className="block mb-1">تصاویر محصول</label>
          <ImageUploader
            images={watch('images', [])}
            onImagesChange={(urls) => setValue('images', urls)}
          />
        </div>

        {/* توضیحات و راهنمای نصب */}
        <div className="space-y-4">
          <div>
            <label className="block mb-1">توضیحات محصول</label>
            <textarea
              {...register('description')}
              rows={5}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">راهنمای نصب (اختیاری)</label>
            <textarea
              {...register('installationGuide')}
              rows={3}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'در حال ذخیره...' : isEditMode ? 'به‌روزرسانی محصول' : 'افزودن محصول'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border rounded hover:bg-gray-50"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
}