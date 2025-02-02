// frontend/src/pages/checkout.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { ShippingForm } from '@/components/checkout/ShippingForm';
import { PaymentMethod } from '@/components/checkout/PaymentMethod';
import { orderService } from '@/services/order.service';

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'wallet'>('online');
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const response = await orderService.createOrder({
        shippingAddress: data,
        paymentMethod
      });

      if (paymentMethod === 'online') {
        // ریدایرکت به درگاه پرداخت
        window.location.href = response.data.paymentLink;
      } else {
        router.push(`/orders/${response.data.orderId}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">تکمیل سفارش</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">آدرس تحویل</h2>
            <ShippingForm register={register} errors={errors} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">روش پرداخت</h2>
            <PaymentMethod
              selected={paymentMethod}
              onSelect={setPaymentMethod}
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <OrderSummary
            onSubmit={handleSubmit(onSubmit)}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

// frontend/src/components/checkout/ShippingForm.tsx
export const ShippingForm = ({ register, errors }) => {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            استان
          </label>
          <select
            {...register('province', { required: 'استان را انتخاب کنید' })}
            className="w-full border rounded-md p-2"
          >
            {/* لیست استان‌ها */}
          </select>
          {errors.province && (
            <p className="text-red-500 text-sm mt-1">{errors.province.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            شهر
          </label>
          <select
            {...register('city', { required: 'شهر را انتخاب کنید' })}
            className="w-full border rounded-md p-2"
          >
            {/* لیست شهرها */}
          </select>
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          آدرس کامل
        </label>
        <textarea
          {...register('address', { required: 'آدرس را وارد کنید' })}
          className="w-full border rounded-md p-2"
          rows={3}
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          کد پستی
        </label>
        <input
          type="text"
          {...register('postalCode', {
            required: 'کد پستی را وارد کنید',
            pattern: {
              value: /^\d{10}$/,
              message: 'کد پستی معتبر نیست'
            }
          })}
          className="w-full border rounded-md p-2"
        />
        {errors.postalCode && (
          <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            نام تحویل گیرنده
          </label>
          <input
            type="text"
            {...register('receiver.name', { required: 'نام تحویل گیرنده را وارد کنید' })}
            className="w-full border rounded-md p-2"
          />
          {errors.receiver?.name && (
            <p className="text-red-500 text-sm mt-1">{errors.receiver.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            شماره موبایل
          </label>
          <input
            type="tel"
            {...register('receiver.phone', {
              required: 'شماره موبایل را وارد کنید',
              pattern: {
                value: /^09\d{9}$/,
                message: 'شماره موبایل معتبر نیست'
              }
            })}
            className="w-full border rounded-md p-2"
          />
          {errors.receiver?.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.receiver.phone.message}</p>
          )}
        </div>
      </div>
    </form>
  );
};