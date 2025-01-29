// frontend/src/pages/checkout/index.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/utils/format';

interface CheckoutForm {
  fullName: string;
  phone: string;
  address: string;
  postalCode: string;
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CheckoutForm>();

  const onSubmit = async (data: CheckoutForm) => {
    try {
      setLoading(true);
      // ارسال اطلاعات به سرور و پرداخت
      // در صورت موفقیت:
      clearCart();
      // انتقال به صفحه موفقیت
    } catch (error) {
      console.error(error);
      // نمایش خطا
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">تکمیل خرید</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block mb-2">نام و نام خانوادگی</label>
              <input
                type="text"
                {...register('fullName', { required: 'این فیلد الزامی است' })}
                className="w-full p-2 border rounded"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2">شماره تماس</label>
              <input
                type="tel"
                {...register('phone', {
                  required: 'این فیلد الزامی است',
                  pattern: {
                    value: /^(\+98|0)?9\d{9}$/,
                    message: 'شماره تماس معتبر نیست'
                  }
                })}
                className="w-full p-2 border rounded"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2">آدرس</label>
              <textarea
                {...register('address', { required: 'این فیلد الزامی است' })}
                className="w-full p-2 border rounded"
                rows={3}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2">کد پستی</label>
              <input
                type="text"
                {...register('postalCode', {
                  required: 'این فیلد الزامی است',
                  pattern: {
                    value: /^\d{10}$/,
                    message: 'کد پستی معتبر نیست'
                  }
                })}
                className="w-full p-2 border rounded"
              />
              {errors.postalCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.postalCode.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'در حال پردازش...' : 'پرداخت و ثبت سفارش'}
            </button>
          </form>
        </div>

        {/* خلاصه سفارش */}
        <div className="bg-white p-4 rounded-lg shadow h-fit">
          <h2 className="text-lg font-bold mb-4">خلاصه سفارش</h2>
          
          <div className="space-y-4 mb-4">
            {items.map(item => (
              <div key={item._id} className="flex justify-between">
                <span>{item.title} × {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between font-bold">
              <span>جمع کل:</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}