// frontend/src/pages/admin/cms/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { ContentList } from '@/components/admin/cms/ContentList';
import { ContentForm } from '@/components/admin/cms/ContentForm';
import { MediaLibrary } from '@/components/admin/cms/MediaLibrary';
import { cmsService } from '@/services/cms.service';
import { Tabs } from '@/components/common/Tabs';

export default function AdminCMS() {
  const [activeTab, setActiveTab] = useState('pages');
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: ''
  });

  const tabs = [
    { id: 'pages', label: 'صفحات' },
    { id: 'posts', label: 'مقالات' },
    { id: 'categories', label: 'دسته‌بندی‌ها' },
    { id: 'media', label: 'رسانه‌ها' }
  ];

  useEffect(() => {
    if (activeTab !== 'media') {
      fetchContents();
    }
  }, [activeTab, filters]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await cmsService.getContents({
        type: activeTab,
        ...filters
      });
      setContents(response.data);
    } catch (error) {
      console.error('Error fetching contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editing) {
        await cmsService.updateContent(editing._id, {
          ...data,
          type: activeTab
        });
      } else {
        await cmsService.createContent({
          ...data,
          type: activeTab
        });
      }
      await fetchContents();
      setEditing(null);
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('آیا از حذف این محتوا اطمینان دارید؟')) {
      try {
        await cmsService.deleteContent(id);
        await fetchContents();
      } catch (error) {
        console.error('Error deleting content:', error);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-bold">مدیریت محتوا</h1>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="p-6">
          {/* فیلترها */}
          {activeTab !== 'media' && (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <option value="published">منتشر شده</option>
                  <option value="draft">پیش‌نویس</option>
                </select>
                {(activeTab === 'posts' || activeTab === 'media') && (
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="border rounded-lg p-2"
                  >
                    <option value="">همه دسته‌بندی‌ها</option>
                    {/* دسته‌بندی‌ها از API */}
                  </select>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* فرم محتوا */}
            <div className="lg:col-span-1">
              {activeTab !== 'media' ? (
                <ContentForm
                  type={activeTab}
                  initialData={editing}
                  onSubmit={handleSave}
                  onCancel={() => setEditing(null)}
                />
              ) : (
                <MediaLibrary />
              )}
            </div>

            {/* لیست محتوا */}
            <div className="lg:col-span-2">
              {activeTab !== 'media' && (
                <ContentList
                  items={contents}
                  loading={loading}
                  type={activeTab}
                  onEdit={setEditing}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
