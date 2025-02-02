// frontend/src/pages/orders/[id].tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { orderService } from '@/services/order.service';
import { OrderStatus } from '@/components/orders/OrderStatus';
import { formatDate, formatPrice } from '@/utils/format';

export default function OrderDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrderDetails(id as string);
    }
  }, [id]);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await orderService.getOrderDetails(orderId);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>در حال بارگذاری...</div>;
  }

  if (!order) {
    return <div>سفارش یافت نشد</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow">
        {/* هدر سفارش */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                جزئیات سفارش #{order._id}
              </h1>
              <p className="text-gray-600">
                تاریخ ثبت: {formatDate(order.createdAt)}
              </p>
            </div>
            <OrderStatus status={order.orderStatus} />
          </div>
        </div>

        {/* اطلاعات ارسال */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold mb-4">اطلاعات ارسال</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">گیرنده</p>
              <p>{order.shippingAddress.receiver.name}</p>
              <p>{order.shippingAddress.receiver.phone}</p>
            </div>
            <div>
              <p className="text-gray-600">آدرس تحویل</p>
              <p>
                {order.shippingAddress.province} - {order.shippingAddress.city}
              </p>
              <p>{order.shippingAddress.address}</p>
              <p>کد پستی: {order.shippingAddress.postalCode}</p>
            </div>
          </div>
        </div>

        {/* اقلام سفارش */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold mb-4">اقلام سفارش</h2>
          <div className="space-y-4">
            {order.items.map((item: any) => (
              <div
                key={item._id}
                className="flex items-center py-4 border-b last:border-0"
              >
                <div className="relative w-20 h-20 ml-4">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.product.title}</h3>
                  <p className="text-gray-600">
                    {item.quantity} عدد × {formatPrice(item.price)}
                  </p>
                </div>
                <div className="font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* خلاصه مالی */}
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">خلاصه مالی</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>جمع کل خرید</span>
              <span>{formatPrice(order.totalPrice - order.shippingCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>هزینه ارسال</span>
              <span>{formatPrice(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>مبلغ کل</span>
              <span>{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}