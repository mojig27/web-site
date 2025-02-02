// frontend/src/pages/admin/orders/[id].tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { AdminLayout } from '@/components/admin/layout';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { UpdateStatusModal } from '@/components/admin/orders/UpdateStatusModal';
import { orderService } from '@/services/order.service';
import { formatPrice, formatDate } from '@/utils/format';

export default function AdminOrderDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isStatusModalOpen, setStatusModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAdminOrderDetails(id as string);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string, trackingCode?: string) => {
    try {
      await orderService.updateOrderStatus(order._id, {
        status: newStatus,
        trackingCode
      });
      fetchOrderDetails();
      setStatusModalOpen(false);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div>در حال بارگذاری...</div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div>سفارش یافت نشد</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* هدر صفحه */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                سفارش #{order._id.slice(-8)}
              </h1>
              <p className="text-gray-600">
                ثبت شده در {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                بازگشت
              </button>
              <button
                onClick={() => setStatusModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                تغییر وضعیت
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">وضعیت سفارش</div>
              <StatusBadge type="order" status={order.orderStatus} />
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">وضعیت پرداخت</div>
              <StatusBadge type="payment" status={order.paymentStatus} />
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">مبلغ کل</div>
              <div className="font-semibold mt-1">
                {formatPrice(order.totalPrice)}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">روش پرداخت</div>
              <div className="font-semibold mt-1">
                {order.paymentMethod === 'online' ? 'آنلاین' : 'کیف پول'}
              </div>
            </div>
          </div>
        </div>

        {/* اطلاعات مشتری و ارسال */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">اطلاعات مشتری</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">نام</div>
                <div>{order.shippingAddress.receiver.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">شماره تماس</div>
                <div>{order.shippingAddress.receiver.phone}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">آدرس</div>
                <div>
                  {order.shippingAddress.province} - {order.shippingAddress.city}
                  <br />
                  {order.shippingAddress.address}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">کد پستی</div>
                <div className="font-mono">
                  {order.shippingAddress.postalCode}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">اطلاعات ارسال</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">هزینه ارسال</div>
                <div>{formatPrice(order.shippingCost)}</div>
              </div>
              {order.trackingCode && (
                <div>
                  <div className="text-sm text-gray-600">کد رهگیری</div>
                  <div className="font-mono">{order.trackingCode}</div>
                </div>
              )}
              {order.orderStatus === 'shipping' && (
                <div className="mt-4">
                  <button
                    onClick={() => window.open('URL_TRACKING_SYSTEM', '_blank')}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    پیگیری مرسوله
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* اقلام سفارش */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">اقلام سفارش</h2>
          <div className="divide-y">
            {order.items.map((item: any) => (
              <div key={item._id} className="py-4 flex items-center">
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
                  <div className="text-sm text-gray-600 mt-1">
                    {item.quantity} عدد × {formatPrice(item.price)}
                  </div>
                </div>
                <div className="font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between mb-2">
              <span>جمع کل خرید</span>
              <span>{formatPrice(order.totalPrice - order.shippingCost)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>هزینه ارسال</span>
              <span>{formatPrice(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>مبلغ کل</span>
              <span>{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* مودال تغییر وضعیت */}
      <UpdateStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        currentStatus={order.orderStatus}
        onUpdate={handleStatusUpdate}
      />
    </AdminLayout>
  );
}