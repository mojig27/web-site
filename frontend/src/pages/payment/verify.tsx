// frontend/src/pages/payment/verify.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { orderService } from '@/services/order.service';
import { PaymentResult } from '@/components/payment/PaymentResult';

export default function PaymentVerifyPage() {
  const router = useRouter();
  const { orderId, status, trackId } = router.query;
  const [loading, setLoading] = useState(true);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  useEffect(() => {
    if (orderId && status) {
      verifyPayment();
    }
  }, [orderId, status]);

  const verifyPayment = async () => {
    try {
      const response = await orderService.verifyPayment({
        orderId: orderId as string,
        status: status as string,
        transactionId: trackId as string
      });
      setVerificationResult(response.data);
    } catch (error) {
      console.error('Error verifying payment:', error);
      setVerificationResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p>در حال بررسی نتیجه پرداخت...</p>
        </div>
      </div>
    );
  }

  return <PaymentResult result={verificationResult} />;
}

// frontend/src/components/payment/PaymentResult.tsx
import Link from 'next/link';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface PaymentResultProps {
  result: {
    success: boolean;
    order?: any;
    error?: string;
  };
}

export const PaymentResult: React.FC<PaymentResultProps> = ({ result }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 text-center">
        {result.success ? (
          <>
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-green-600 mb-2">
              پرداخت موفق
            </h1>
            <p className="text-gray-600 mb-6">
              سفارش شما با موفقیت ثبت شد و در حال پردازش است.
            </p>
            <div className="bg-gray-50 p-4 rounded mb-6">
              <p className="text-sm text-gray-600 mb-2">
                شماره سفارش: {result.order._id}
              </p>
              <p className="text-sm text-gray-600">
                مبلغ پرداخت شده: {result.order.totalPrice.toLocaleString()} تومان
              </p>
            </div>
          </>
        ) : (
          <>
            <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-600 mb-2">
              پرداخت ناموفق
            </h1>
            <p className="text-gray-600 mb-6">
              {result.error || 'متأسفانه پرداخت شما با مشکل مواجه شد.'}
            </p>
          </>
        )}

        <div className="flex justify-center gap-4">
          <Link
            href="/orders"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            پیگیری سفارش
          </Link>
          <Link
            href="/"
            className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200"
          >
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    </div>
  );
};

// frontend/src/pages/orders/index.tsx
import { useEffect, useState } from 'react';
import { orderService } from '@/services/order.service';
import { OrderList } from '@/components/orders/OrderList';
import { OrderStatus } from '@/components/orders/OrderStatus';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getUserOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">سفارش‌های من</h1>
      {loading ? (
        <div>در حال بارگذاری...</div>
      ) : (
        <OrderList orders={orders} />
      )}
    </div>
  );
}

// frontend/src/components/orders/OrderList.tsx
import Link from 'next/link';
import { OrderStatus } from './OrderStatus';
import { formatDate } from '@/utils/format';

export const OrderList = ({ orders }) => {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold">
                سفارش #{order._id}
              </h3>
              <p className="text-sm text-gray-600">
                {formatDate(order.createdAt)}
              </p>
            </div>
            <OrderStatus status={order.orderStatus} />
          </div>

          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">مبلغ کل</p>
                <p className="font-semibold">
                  {order.totalPrice.toLocaleString()} تومان
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">وضعیت پرداخت</p>
                <p className={`font-semibold ${
                  order.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {order.paymentStatus === 'paid' ? 'پرداخت شده' : 'پرداخت نشده'}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {order.items.length} کالا
              </p>
              <Link
                href={`/orders/${order._id}`}
                className="text-blue-600 hover:text-blue-700"
              >
                مشاهده جزئیات
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// frontend/src/components/orders/OrderStatus.tsx
interface OrderStatusProps {
  status: 'processing' | 'shipping' | 'delivered' | 'canceled';
}

export const OrderStatus: React.FC<OrderStatusProps> = ({ status }) => {
  const statusConfig = {
    processing: {
      label: 'در حال پردازش',
      color: 'bg-blue-100 text-blue-800'
    },
    shipping: {
      label: 'در حال ارسال',
      color: 'bg-yellow-100 text-yellow-800'
    },
    delivered: {
      label: 'تحویل شده',
      color: 'bg-green-100 text-green-800'
    },
    canceled: {
      label: 'لغو شده',
      color: 'bg-red-100 text-red-800'
    }
  };

  const config = statusConfig[status];

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${config.color}`}>
      {config.label}
    </span>
  );
};