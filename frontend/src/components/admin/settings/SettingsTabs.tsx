
// frontend/src/components/admin/settings/SettingsTabs.tsx
interface SettingsTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
  }
  
  export const SettingsTabs: React.FC<SettingsTabsProps> = ({
    activeTab,
    onTabChange
  }) => {
    const tabs = [
      { id: 'general', label: 'تنظیمات عمومی' },
      { id: 'shipping', label: 'تنظیمات ارسال' },
      { id: 'payment', label: 'تنظیمات پرداخت' },
      { id: 'notifications', label: 'تنظیمات اعلان‌ها' }
    ];
  
    return (
      <div className="border-b">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    );
  };
  
  