// frontend/src/pages/admin/shipping/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { OrderList } from '@/components/admin/shipping/OrderList';
import { ShipmentForm } from '@/components/admin/shipping/ShipmentForm';
import { DeliveryMap } from '@/components/admin/shipping/DeliveryMap';
import { shippingService } from '@/services/shipping.service';
import { orderService } from '@/services/order.service';

export default function AdminShipping() {
  const [activeView, setActiveView] = useState('pending');
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deliveryStats, setDeliveryStats] = useState<any>(null);

  const views = [
    { id: 'pending', label: 'در انتظار ارسال' },
    { id: 'processing', label: 'در حال پردازش' },
    { id: 'shipped', label: 'ارسال شده' },
    { id: 'delivered', label: 'تحویل شده' },
    { id: 'map', label: 'نقشه ارسال‌ها' }
  ];

  useEffect(() => {
    fetchOrders();
    if (activeView === 'map') {
      fetchDeliveryStats();
    }
  }, [activeView]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrders({
        status: activeView,
        includeShipping: true
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryStats = async () => {
    try {
      const response = await shippingService.getDeliveryStats();
      setDeliveryStats(response.data);
    } catch (error) {
      console.error('Error fetching delivery stats:', error);
    }
  };

  const handleShipmentCreate = async (data: any) => {
    try {
      await shippingService.createShipment({
        orderId: selectedOrder._id,
        ...data
      });
      await fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error creating shipment:', error);
    }
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await shippingService.updateShipmentStatus(orderId, status);
      await fetchOrders();
    } catch (error) {
      console.error('Error updating shipment status:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">مدیریت سفارشات و ارسال</h1>
            <div className="flex gap-4">
              {/* اضافه کردن فیلترها و جستجو */}
              <input
                type="text"
                placeholder="جستجوی سفارش..."
                className="border rounded-lg p-2"
              />
              <select className="border rounded-lg p-2">
                <option value="">همه روش‌های ارسال</option>
                <option value="express">پست پیشتاز</option>
                <option value="normal">پست عادی</option>
                <option value="peyk">پیک موتوری</option>
              </select>
            </div>
          </div>
        </div>

        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeView === view.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {view.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeView === 'map' ? (
            <DeliveryMap
              deliveries={deliveryStats?.deliveries || []}
              stats={deliveryStats?.stats}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* لیست سفارش‌ها */}
              <div className="lg:col-span-2">
                <OrderList
                  orders={orders}
                  loading={loading}
                  selectedId={selectedOrder?._id}
                  onSelect={setSelectedOrder}
                  onStatusUpdate={handleStatusUpdate}
                />
              </div>

              {/* فرم ارسال */}
              <div className="lg:col-span-1">
                {selectedOrder ? (
                  <ShipmentForm
                    order={selectedOrder}
                    onSubmit={handleShipmentCreate}
                    onCancel={() => setSelectedOrder(null)}
                  />
                ) : (
                  <div className="text-center p-6 text-gray-500 border rounded-lg">
                    یک سفارش را برای ایجاد ارسال انتخاب کنید
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
