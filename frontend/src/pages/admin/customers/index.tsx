// frontend/src/pages/admin/customers/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { CustomerList } from '@/components/admin/customers/CustomerList';
import { CustomerForm } from '@/components/admin/customers/CustomerForm';
import { RoleManagement } from '@/components/admin/customers/RoleManagement';
import { customerService } from '@/services/customer.service';
import { Tabs } from '@/components/common/Tabs';

export default function AdminCustomers() {
  const [activeTab, setActiveTab] = useState('customers');
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    role: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  const tabs = [
    { id: 'customers', label: 'مشتریان' },
    { id: 'roles', label: 'نقش‌ها و دسترسی‌ها' },
    { id: 'groups', label: 'گروه‌های مشتریان' }
  ];

  useEffect(() => {
    fetchCustomers();
  }, [filters, activeTab]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.getCustomers(filters);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editing) {
        await customerService.updateCustomer(editing._id, data);
      } else {
        await customerService.createCustomer(data);
      }
      await fetchCustomers();
      setEditing(null);
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-bold">مدیریت مشتریان</h1>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="p-6">
          {/* فیلترها */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="جستجو..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="border rounded-lg p-2"
              />
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="border rounded-lg p-2"
              >
                <option value="">همه وضعیت‌ها</option>
                <option value="active">فعال</option>
                <option value="inactive">غیرفعال</option>
                <option value="blocked">مسدود شده</option>
              </select>
              <select
                value={filters.role}
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                className="border rounded-lg p-2"
              >
                <option value="">همه نقش‌ها</option>
                <option value="customer">مشتری عادی</option>
                <option value="vip">مشتری ویژه</option>
                <option value="wholesale">عمده فروش</option>
              </select>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="border rounded-lg p-2"
              >
                <option value="created_at">تاریخ ثبت نام</option>
                <option value="last_order">آخرین سفارش</option>
                <option value="total_orders">تعداد سفارشات</option>
                <option value="total_spent">مجموع خرید</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* فرم مشتری یا مدیریت نقش */}
            <div className="lg:col-span-1">
              {activeTab === 'customers' ? (
                <CustomerForm
                  initialData={editing}
                  onSubmit={handleSave}
                  onCancel={() => setEditing(null)}
                />
              ) : activeTab === 'roles' ? (
                <RoleManagement />
              ) : (
                <CustomerGroupForm />
              )}
            </div>

            {/* لیست مشتریان */}
            <div className="lg:col-span-2">
              <CustomerList
                customers={customers}
                loading={loading}
                onEdit={setEditing}
                onDelete={async (id) => {
                  if (window.confirm('آیا از حذف این مشتری اطمینان دارید؟')) {
                    await customerService.deleteCustomer(id);
                    await fetchCustomers();
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
