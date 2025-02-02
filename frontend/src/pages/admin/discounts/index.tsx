// frontend/src/pages/admin/discounts/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { DiscountForm } from '@/components/admin/discounts/DiscountForm';
import { DiscountList } from '@/components/admin/discounts/DiscountList';
import { discountService } from '@/services/discount.service';
import { Tabs } from '@/components/common/Tabs';

export default function AdminDiscounts() {
  const [activeTab, setActiveTab] = useState('coupons');
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);

  const tabs = [
    { id: 'coupons', label: 'کدهای تخفیف' },
    { id: 'products', label: 'تخفیف محصولات' },
    { id: 'categories', label: 'تخفیف دسته‌بندی‌ها' }
  ];

  useEffect(() => {
    fetchDiscounts();
  }, [activeTab]);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const response = await discountService.getDiscounts(activeTab);
      setDiscounts(response.data);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editing) {
        await discountService.updateDiscount(editing._id, data);
      } else {
        await discountService.createDiscount(data);
      }
      await fetchDiscounts();
      setEditing(null);
    } catch (error) {
      console.error('Error saving discount:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('آیا از حذف این تخفیف اطمینان دارید؟')) {
      try {
        await discountService.deleteDiscount(id);
        await fetchDiscounts();
      } catch (error) {
        console.error('Error deleting discount:', error);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-bold">مدیریت تخفیف‌ها</h1>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <DiscountForm
                type={activeTab}
                initialData={editing}
                onSubmit={handleSave}
                onCancel={() => setEditing(null)}
              />
            </div>
            <div className="lg:col-span-2">
              <DiscountList
                items={discounts}
                loading={loading}
                onEdit={setEditing}
                onDelete={handleDelete}
                type={activeTab}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
