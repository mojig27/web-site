// frontend/src/components/admin/orders/Invoice.tsx
import { formatPrice, formatDate } from '@/utils/format';

interface InvoiceProps {
  order: any;
  companyInfo: {
    name: string;
    logo: string;
    address: string;
    phone: string;
    website: string;
    taxId: string;
  };
}

export const Invoice: React.FC<InvoiceProps> = ({ order, companyInfo }) => {
  return (
    <div className="bg-white p-8 max-w-4xl mx-auto" id="invoice-print">
      {/* هدر فاکتور */}
      <div className="flex justify-between items-start mb-8 border-b pb-6">
        <div>
          <img src={companyInfo.logo} alt="Logo" className="h-12 mb-2" />
          <h1 className="text-2xl font-bold">{companyInfo.name}</h1>
        </div>
        <div className="text-left">
          <div className="text-2xl font-bold mb-2">فاکتور فروش</div>
          <div>شماره: {order._id.slice(-8)}</div>
          <div>تاریخ: {formatDate(order.createdAt)}</div>
        </div>
      </div>

      {/* اطلاعات شرکت و مشتری */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="font-semibold mb-2">فروشنده:</h2>
          <div className="text-gray-600">
            <p>{companyInfo.name}</p>
            <p>{companyInfo.address}</p>
            <p>تلفن: {companyInfo.phone}</p>
            <p>وبسایت: {companyInfo.website}</p>
            <p>شناسه مالیاتی: {companyInfo.taxId}</p>
          </div>
        </div>
        <div>
          <h2 className="font-semibold mb-2">خریدار:</h2>
          <div className="text-gray-600">
            <p>{order.shippingAddress.receiver.name}</p>
            <p>
              {order.shippingAddress.province} - {order.shippingAddress.city}
            </p>
            <p>{order.shippingAddress.address}</p>
            <p>کد پستی: {order.shippingAddress.postalCode}</p>
            <p>تلفن: {order.shippingAddress.receiver.phone}</p>
          </div>
        </div>
      </div>

      {/* جدول اقلام */}
      <table className="w-full mb-8">
        <thead>
          <tr className="bg-gray-50">
            <th className="py-2 px-4 text-right">#</th>
            <th className="py-2 px-4 text-right">شرح کالا</th>
            <th className="py-2 px-4 text-center">تعداد</th>
            <th className="py-2 px-4 text-left">قیمت واحد (تومان)</th>
            <th className="py-2 px-4 text-left">قیمت کل (تومان)</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item: any, index: number) => (
            <tr key={item._id} className="border-b">
              <td className="py-2 px-4">{index + 1}</td>
              <td className="py-2 px-4">{item.product.title}</td>
              <td className="py-2 px-4 text-center">{item.quantity}</td>
              <td className="py-2 px-4 text-left">{formatPrice(item.price)}</td>
              <td className="py-2 px-4 text-left">
                {formatPrice(item.price * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* جمع کل */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span>جمع کل خرید:</span>
            <span>{formatPrice(order.totalPrice - order.shippingCost)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>هزینه ارسال:</span>
            <span>{formatPrice(order.shippingCost)}</span>
          </div>
          <div className="flex justify-between py-2 font-bold border-t">
            <span>مبلغ قابل پرداخت:</span>
            <span>{formatPrice(order.totalPrice)}</span>
          </div>
        </div>
      </div>

      {/* پاورقی */}
      <div className="text-sm text-gray-500 text-center mt-8 pt-8 border-t">
        <p>این فاکتور به صورت الکترونیکی صادر شده و فاقد اعتبار بدون مهر و امضا می‌باشد.</p>
        <p className="mt-2">
          {companyInfo.website} | {companyInfo.phone}
        </p>
      </div>
    </div>
  );
};
