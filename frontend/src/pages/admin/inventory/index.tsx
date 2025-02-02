// frontend/src/pages/admin/inventory/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { InventoryList } from '@/components/admin/inventory/InventoryList';
import { InventoryForm } from '@/components/admin/inventory/InventoryForm';
import { StockMovement } from '@/components/admin/inventory/StockMovement';
import { inventoryService } from '@/services/inventory.service';
import { Tabs } from '@/components/common/Tabs';

export default function AdminInventory() {
  const [activeTab, setActiveTab] = useState('products');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: ''
  });

  const tabs = [
    { id: 'products', label: 'موجودی محصولات' },
    { id: 'movements', label: 'گردش موجودی' },
    { id: 'alerts', label: 'هشدارها' }
  ];

  useEffect(() => {
    fetchInventory();
  }, [activeTab, filters]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await inventoryService.getInventory({
        type: activeTab,
        ...filters
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (data: any) => {
    try {
      await inventoryService.updateStock(data);
      await fetchInventory();
      setEditing(null);
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-bold">مدیریت موجودی و انبار</h1>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="p-6">
          {/* فیلترها */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="جستجو..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">همه وضعیت‌ها</option>
                  <option value="in_stock">موجود</option>
                  <option value="low_stock">رو به اتمام</option>
                  <option value="out_of_stock">ناموجود</option>
                </select>
              </div>
              <div>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">همه دسته‌بندی‌ها</option>
                  {/* دسته‌بندی‌ها از API */}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* فرم ویرایش موجودی */}
            <div className="lg:col-span-1">
              {activeTab === 'products' && (
                <InventoryForm
                  initialData={editing}
                  onSubmit={handleUpdateStock}
                  onCancel={() => setEditing(null)}
                />
              )}
              {activeTab === 'movements' && selectedProduct && (
                <StockMovement
                  product={selectedProduct}
                  onClose={() => setSelectedProduct(null)}
                />
              )}
            </div>

            {/* لیست موجودی */}
            <div className="lg:col-span-2">
              <InventoryList
                items={items}
                loading={loading}
                type={activeTab}
                onEdit={setEditing}
                onSelect={setSelectedProduct}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
