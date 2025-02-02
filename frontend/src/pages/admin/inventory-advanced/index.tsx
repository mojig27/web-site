// frontend/src/pages/admin/inventory-advanced/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { InventoryDashboard } from '@/components/admin/inventory/InventoryDashboard';
import { StockManagement } from '@/components/admin/inventory/StockManagement';
import { WarehouseMap } from '@/components/admin/inventory/WarehouseMap';
import { inventoryService } from '@/services/inventory.service';
import { BarcodeScanner } from '@/components/admin/inventory/BarcodeScanner';

export default function AdminInventoryAdvanced() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [scannerActive, setScannerActive] = useState(false);

  const views = [
    { id: 'dashboard', label: 'داشبورد انبار' },
    { id: 'stock', label: 'مدیریت موجودی' },
    { id: 'warehouse', label: 'نقشه انبار' },
    { id: 'movements', label: 'گردش کالا' }
  ];

  useEffect(() => {
    fetchInventoryData();
  }, [activeView, selectedWarehouse]);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const response = await inventoryService.getAdvancedInventory({
        view: activeView,
        warehouseId: selectedWarehouse
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeScanned = async (barcode: string) => {
    try {
      const response = await inventoryService.getProductByBarcode(barcode);
      // اینجا می‌توانید محصول اسکن شده را مدیریت کنید
      console.log('Scanned product:', response.data);
    } catch (error) {
      console.error('Error scanning barcode:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">مدیریت پیشرفته انبار</h1>
            <div className="flex items-center gap-4">
              <select
                value={selectedWarehouse || ''}
                onChange={(e) => setSelectedWarehouse(e.target.value || null)}
                className="border rounded-lg p-2"
              >
                <option value="">همه انبارها</option>
                <option value="main">انبار مرکزی</option>
                <option value="north">انبار شمال</option>
                <option value="south">انبار جنوب</option>
              </select>
              <button
                onClick={() => setScannerActive(!scannerActive)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                <span>{scannerActive ? 'بستن' : 'اسکن'} بارکد</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v-4m6 0h-2m2 0v4m-6-4h2m-2 0v4m-6-4h2m-2 0v4m0 6h2m-2 0v4m6-4h2m-2 0v4m6-4h2m-2 0v4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="border-b">
          <nav className="flex space-x-8 px-6" aria-label="Views">
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
          {scannerActive && (
            <div className="mb-6">
              <BarcodeScanner
                onScan={handleBarcodeScanned}
                onClose={() => setScannerActive(false)}
              />
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">در حال بارگذاری...</div>
          ) : (
            <div className="space-y-6">
              {activeView === 'dashboard' && (
                <InventoryDashboard
                  data={data}
                  warehouseId={selectedWarehouse}
                />
              )}

              {activeView === 'stock' && (
                <StockManagement
                  data={data}
                  warehouseId={selectedWarehouse}
                  onUpdate={fetchInventoryData}
                />
              )}

              {activeView === 'warehouse' && (
                <WarehouseMap
                  data={data}
                  warehouseId={selectedWarehouse}
                  onLocationUpdate={fetchInventoryData}
                />
              )}

              {activeView === 'movements' && (
                <InventoryMovements
                  data={data}
                  warehouseId={selectedWarehouse}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
