// frontend/src/pages/admin/notifications/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { TemplateForm } from '@/components/admin/notifications/TemplateForm';
import { TemplateList } from '@/components/admin/notifications/TemplateList';
import { AutomationRules } from '@/components/admin/notifications/AutomationRules';
import { notificationService } from '@/services/notification.service';

export default function AdminNotifications() {
  const [activeTab, setActiveTab] = useState('email');
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any>(null);

  const tabs = [
    { id: 'email', label: 'قالب‌های ایمیل' },
    { id: 'sms', label: 'قالب‌های پیامک' },
    { id: 'automation', label: 'قوانین خودکار' }
  ];

  useEffect(() => {
    if (activeTab !== 'automation') {
      fetchTemplates();
    }
  }, [activeTab]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getTemplates(activeTab);
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editing) {
        await notificationService.updateTemplate(editing._id, {
          ...data,
          type: activeTab
        });
      } else {
        await notificationService.createTemplate({
          ...data,
          type: activeTab
        });
      }
      await fetchTemplates();
      setEditing(null);
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handleTest = async (template: any, testData: any) => {
    try {
      await notificationService.testTemplate(template._id, testData);
      alert('پیام تست با موفقیت ارسال شد.');
    } catch (error) {
      console.error('Error testing template:', error);
      alert('خطا در ارسال پیام تست');
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-bold">مدیریت اطلاع‌رسانی‌ها</h1>
        </div>

        <div className="border-b">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
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
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* فرم ویرایش قالب */}
            <div>
              {activeTab === 'automation' ? (
                <AutomationRules />
              ) : (
                <TemplateForm
                  type={activeTab}
                  initialData={editing}
                  onSubmit={handleSave}
                  onCancel={() => setEditing(null)}
                  onPreview={(data) => setPreviewData(data)}
                />
              )}
            </div>

            {/* لیست قالب‌ها */}
            <div>
              {activeTab !== 'automation' && (
                <TemplateList
                  items={templates}
                  loading={loading}
                  type={activeTab}
                  onEdit={setEditing}
                  onTest={handleTest}
                  onDelete={async (id) => {
                    if (window.confirm('آیا از حذف این قالب اطمینان دارید؟')) {
                      await notificationService.deleteTemplate(id);
                      await fetchTemplates();
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

