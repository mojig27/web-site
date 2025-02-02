// frontend/src/pages/admin/orders/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { DataTable } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { orderService } from '@/services/order.service';
import { formatPrice, formatDate } from '@/utils/format';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  const columns = [
    {
      title: 'شماره سفارش',
      key: '_id',
      render: (order) => (
        <span className="font-mono">{order._id.slice(-8)}</span>
      )
    },
    {
      title: 'مشتری',
      key: 'customer',
      render: (order) => (
        <div>
          <div>{order.shippingAddress.receiver.name}</div>
          <div className="text-sm text-gray-500">
            {order.shippingAddress.receiver.phone}
          </div>
        </div>
      )
    },
    {
      title: 'مبلغ کل',
      key: 'totalPrice',
      render: (order) => formatPrice(order.totalPrice)
    },
    {
      title: 'وضعیت سفارش',
      key: 'orderStatus',
      render: (order) => (
        <StatusBadge
          type="order"
          status={order.orderStatus}
          onClick={() => handleStatusChange(order._id)}
        />
      )
    },
    {
      title: 'وضعیت پرداخت',
      key: 'paymentStatus',
      render: (order) => (
        <StatusBadge type="payment" status={order.paymentStatus} />
      )
    },
    {
      title: 'تاریخ ثبت',
      key: 'createdAt',
      render: (order) => formatDate(order.createdAt)
    },
    {
      title: 'عملیات',
      key: 'actions',
      render: (order) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewDetails(order._id)}
            className="text-blue-600 hover:text-blue-700"
          >
            جزئیات
          </button>
          <button
            onClick={() => handlePrintInvoice(order._id)}
            className="text-gray-600 hover:text-gray-700"
          >
            چاپ فاکتور
          </button>
        </div>
      )
    }
  ];

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAdminOrders({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });
      setOrders(response.data.orders);
      setPagination(prev => ({
        ...prev,
        total: response.data.total
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">مدیریت سفارش‌ها</h1>
          
          <OrderFilters
            filters={filters}
            onChange={setFilters}
          />
        </div>

        <DataTable
          columns={columns}
          data={orders}
          loading={loading}
          pagination={{
            current: pagination.page,
            total: pagination.total,
            pageSize: pagination.limit,
            onChange: (page) => setPagination(prev => ({ ...prev, page }))
          }}
        />
      </div>
    </AdminLayout>
  );
}
