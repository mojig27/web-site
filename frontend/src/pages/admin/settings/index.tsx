// frontend/src/pages/admin/settings/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { SettingsTabs } from '@/components/admin/settings/SettingsTabs';
import { GeneralSettings } from '@/components/admin/settings/GeneralSettings';
import { ShippingSettings } from '@/components/admin/settings/ShippingSettings';
import { PaymentSettings } from '@/components/admin/settings/PaymentSettings';
import { NotificationSettings } from '@/components/admin/settings/NotificationSettings';
import { settingsService } from '@/services/settings.service';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsService.getSettings();
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    try {
      setSaving(true);
      await settingsService.updateSettings(data);
      // Refresh settings after update
      await fetchSettings();
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div>در حال بارگذاری...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="p-6">
          {activeTab === 'general' && (
            <GeneralSettings
              settings={settings}
              onSave={handleSave}
              saving={saving}
            />
          )}
          {activeTab === 'shipping' && (
            <ShippingSettings
              settings={settings}
              onSave={handleSave}
              saving={saving}
            />
          )}
          {activeTab === 'payment' && (
            <PaymentSettings
              settings={settings}
              onSave={handleSave}
              saving={saving}
            />
          )}
          {activeTab === 'notifications' && (
            <NotificationSettings
              settings={settings}
              onSave={handleSave}
              saving={saving}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
