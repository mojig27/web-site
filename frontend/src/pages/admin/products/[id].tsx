// frontend/src/pages/admin/products/[id].tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { AdminLayout } from '@/components/admin/layout';
import { ImageUpload } from '@/components/common/ImageUpload';
import { productService } from '@/services/product.service';

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const isEdit = id !== 'new';
  
  const [loading, setLoading] = useState(isEdit);
  const [images, setImages] = useState<string[]>([]);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (isEdit && id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productService.getProduct(id as string);
      const product = response.data;
      
      // پر کردن فرم با اطلاعات محصول
      Object.keys(product).forEach(key => {
        setValue(key, product[key]);
      });
      setImages(product.images);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const productData = {
        ...data,
        images,
        price: Number(data.price),
        stock: Number(data.stock)
      };

      if (isEdit) {
        await productService.updateProduct(id as string, productData);
      } else {
        await productService.createProduct(productData);
      }

      router.push('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div>در حال بارگذاری...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">
          {isEdit ? 'ویرایش محصول' : 'افزودن محصول جدید'}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* عنوان محصول */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                عنوان محصول
              </label>
              <input
                type="text"
                {...register('title', {
                  required: 'عنوان محصول الزامی است',
                  minLength: {
                    value: 3,
                    message: 'عنوان باید حداقل 3 حرف باشد'
                  }
                })}
                className="w-full border rounded-lg p-2"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* دسته‌بندی */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                دسته‌بندی
              </label>
              <select
                {...register('category', { required: 'انتخاب دسته‌بندی الزامی است' })}
                className="w-full border rounded-lg p-2"
              >
                <option value="">انتخاب کنید</option>
                <option value="شیرآلات">شیرآلات</option>
                <option value="سینک">سینک</option>
                <option value="هود">هود</option>
                <option value="گاز">گاز</option>
                <option value="رادیاتور">رادیاتور</option>
                <option value="آبگرمکن">آبگرمکن</option>
                <option value="کولر آبی">کولر آبی</option>
                <option value="کولر گازی">کولر گازی</option>
                <option value="لوله و اتصالات">لوله و اتصالات</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>

            {/* قیمت */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                قیمت (تومان)
              </label>
              <input
                type="number"
                {...register('price', {
                  required: 'قیمت محصول الزامی است',
                  min: {
                    value: 1000,
                    message: 'قیمت باید حداقل 1000 تومان باشد'
                  }
                })}
                className="w-full border rounded-lg p-2"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>

            {/* موجودی */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                موجودی
              </label>
              <input
                type="number"
                {...register('stock', {
                  required: 'موجودی محصول الزامی است',
                  min: {
                    value: 0,
                    message: 'موجودی نمی‌تواند منفی باشد'
                  }
                })}
                className="w-full border rounded-lg p-2"
              />
              {errors.stock && (
                <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
              )}
            </div>

            {/* برند */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                برند
              </label>
              <input
                type="text"
                {...register('brand', { required: 'برند محصول الزامی است' })}
                className="w-full border rounded-lg p-2"
              />
              {errors.brand && (
                <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>
              )}
            </div>

            {/* گارانتی */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                مدت گارانتی (ماه)
              </label>
              <input
                type="number"
                {...register('warranty.months')}
                className="w-full border rounded-lg p-2"
              />
            </div>
          </div>

          {/* توضیحات */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              توضیحات محصول
            </label>
            <textarea
              {...register('description', {
                required: 'توضیحات محصول الزامی است',
                minLength: {
                  value: 50,
                  message: 'توضیحات باید حداقل 50 حرف باشد'
                }
              })}
              rows={5}
              className="w-full border rounded-lg p-2"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* مشخصات فنی */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              مشخصات فنی
            </label>
            <div className="space-y-2">
              {/* می‌توانید از یک کامپوننت پویا برای اضافه کردن مشخصات استفاده کنید */}
              <SpecificationsList
                specifications={specifications}
                onChange={setSpecifications}
              />
            </div>
          </div>

          {/* تصاویر محصول */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              تصاویر محصول
            </label>
            <ImageUpload
              images={images}
              onChange={setImages}
              maxImages={5}
            />
          </div>

          {/* دکمه‌های عملیات */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              ذخیره محصول
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}