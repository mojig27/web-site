// frontend/src/pages/admin/suppliers/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { SupplierList } from '@/components/admin/suppliers/SupplierList';
import { PurchaseOrders } from '@/components/admin/suppliers/PurchaseOrders';
import { supplierService } from '@/services/supplier.service';

export default function AdminSuppliers() {
  const [activeTab, setActiveTab] = useState('suppliers');
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    suppliers: [],
    orders: [],
    products: [],
    stats: {}
  });
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    rating: 'all',
    search: ''
  });

  const tabs = [
    { id: 'suppliers', label: 'تامین‌کنندگان' },
    { id: 'orders', label: 'سفارشات خرید' },
    { id: 'products', label: 'کاتالوگ محصولات' },
    { id: 'analytics', label: 'تحلیل‌ها' }
  ];

  useEffect(() => {
    fetchSupplierData();
  }, [activeTab, filters]);

  const fetchSupplierData = async () => {
    try {
      setLoading(true);
      const response = await supplierService.getData({
        tab: activeTab,
        filters
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching supplier data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">مدیریت تامین‌کنندگان و خرید</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                <span className="text-sm text-green-800">
                  {data.stats?.totalSuppliers || 0} تامین‌کننده فعال
                </span>
              </div>
              <button
                onClick={() => setSelectedSupplier({})}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                افزودن تامین‌کننده جدید
              </button>
            </div>
          </div>
        </div>

        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <div className="flex items-center">
                  {tab.label}
                  {tab.id === 'orders' && data.stats?.pendingOrders > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      {data.stats.pendingOrders}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* فیلترها */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="جستجو در تامین‌کنندگان..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="border rounded-lg p-2"
              />
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="border rounded-lg p-2"
              >
                <option value="all">همه دسته‌ها</option>
                <option value="electronics">الکترونیک</option>
                <option value="clothing">پوشاک</option>
                <option value="food">مواد غذایی</option>
                <option value="raw">مواد اولیه</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="border rounded-lg p-2"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="active">فعال</option>
                <option value="inactive">غیرفعال</option>
                <option value="blacklisted">لیست سیاه</option>
              </select>
              <select
                value={filters.rating}
                onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                className="border rounded-lg p-2"
              >
                <option value="all">همه امتیازها</option>
                <option value="5">5 ستاره</option>
                <option value="4">4 ستاره و بالاتر</option>
                <option value="3">3 ستاره و بالاتر</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {activeTab === 'suppliers' && (
              <>
                {/* لیست تامین‌کنندگان */}
                <div className="lg:col-span-2">
                  <SupplierList
                    suppliers={data.suppliers}
                    loading={loading}
                    onSelect={setSelectedSupplier}
                    onUpdateStatus={async (supplierId, status) => {
                      await supplierService.updateSupplierStatus(supplierId, status);
                      await fetchSupplierData();
                    }}
                    onDelete={async (supplierId) => {
                      if (window.confirm('آیا از حذف این تامین‌کننده اطمینان دارید؟')) {
                        await supplierService.deleteSupplier(supplierId);
                        await fetchSupplierData();
                      }
                    }}
                  />
                </div>

                {/* جزئیات تامین‌کننده */}
                <div className="lg:col-span-1">
                  {selectedSupplier && (
                    <SupplierEditor
                      supplier={selectedSupplier}
                      onSave={async (data) => {
                        if (data.id) {
                          await supplierService.updateSupplier(data.id, data);
                        } else {
                          await supplierService.createSupplier(data);
                        }
                        setSelectedSupplier(null);
                        await fetchSupplierData();
                      }}
                      onCancel={() => setSelectedSupplier(null)}
                    />
                  )}
                </div>
              </>
            )}

            {activeTab === 'orders' && (
              <PurchaseOrders
                orders={data.orders}
                suppliers={data.suppliers}
                onCreateOrder={async (orderData) => {
                  await supplierService.createPurchaseOrder(orderData);
                  await fetchSupplierData();
                }}
                onUpdateOrder={async (orderId, status) => {
                  await supplierService.updateOrderStatus(orderId, status);
                  await fetchSupplierData();
                }}
              />
            )}

            {activeTab === 'products' && (
              <ProductCatalog
                products={data.products}
                suppliers={data.suppliers}
                onAddProduct={async (productData) => {
                  await supplierService.addProduct(productData);
                  await fetchSupplierData();
                }}
                onUpdatePrice={async (productId, price) => {
                  await supplierService.updateProductPrice(productId, price);
                  await fetchSupplierData();
                }}
              />
            )}

            {activeTab === 'analytics' && (
              <SupplierAnalytics
                stats={data.stats}
                onDateRangeChange={async (range) => {
                  const response = await supplierService.getAnalytics(range);
                  setData(prev => ({ ...prev, stats: response.data }));
                }}
              />
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}