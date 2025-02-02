// frontend/src/pages/admin/localization/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { TranslationEditor } from '@/components/admin/localization/TranslationEditor';
import { LanguageManager } from '@/components/admin/localization/LanguageManager';
import { ContentList } from '@/components/admin/localization/ContentList';
import { localizationService } from '@/services/localization.service';

export default function AdminLocalization() {
  const [activeTab, setActiveTab] = useState('content');
  const [selectedLang, setSelectedLang] = useState('fa');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    languages: [],
    translations: {},
    content: []
  });
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    search: ''
  });

  const tabs = [
    { id: 'content', label: 'محتوای چندزبانه' },
    { id: 'translations', label: 'ترجمه‌ها' },
    { id: 'languages', label: 'مدیریت زبان‌ها' }
  ];

  useEffect(() => {
    fetchLocalizationData();
  }, [activeTab, selectedLang, filters]);

  const fetchLocalizationData = async () => {
    try {
      setLoading(true);
      const response = await localizationService.getData({
        tab: activeTab,
        language: selectedLang,
        filters
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching localization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (langData: any) => {
    try {
      if (langData.id) {
        await localizationService.updateLanguage(langData.id, langData);
      } else {
        await localizationService.addLanguage(langData);
      }
      await fetchLocalizationData();
    } catch (error) {
      console.error('Error updating language:', error);
    }
  };

  const handleTranslationSave = async (key: string, translations: any) => {
    try {
      await localizationService.updateTranslations(key, translations);
      await fetchLocalizationData();
    } catch (error) {
      console.error('Error updating translations:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">مدیریت محتوای چندزبانه</h1>
            <div className="flex items-center gap-4">
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="border rounded-lg p-2"
              >
                {data.languages.map((lang: any) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} ({lang.code})
                  </option>
                ))}
              </select>
              <button
                onClick={() => setActiveTab('languages')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                افزودن زبان جدید
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
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* فیلترها */}
          {activeTab !== 'languages' && (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="جستجو..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="border rounded-lg p-2"
                />
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="border rounded-lg p-2"
                >
                  <option value="all">همه انواع محتوا</option>
                  <option value="page">صفحات</option>
                  <option value="product">محصولات</option>
                  <option value="category">دسته‌بندی‌ها</option>
                  <option value="blog">وبلاگ</option>
                </select>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="border rounded-lg p-2"
                >
                  <option value="all">همه وضعیت‌ها</option>
                  <option value="published">منتشر شده</option>
                  <option value="draft">پیش‌نویس</option>
                  <option value="pending">در انتظار ترجمه</option>
                </select>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">در حال بارگذاری...</div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'content' && (
                <ContentList
                  items={data.content}
                  selectedLang={selectedLang}
                  onStatusChange={async (id, status) => {
                    await localizationService.updateContentStatus(id, status);
                    await fetchLocalizationData();
                  }}
                  onEdit={(item) => {
                    // باز کردن ویرایشگر محتوا
                  }}
                />
              )}

              {activeTab === 'translations' && (
                <TranslationEditor
                  translations={data.translations}
                  languages={data.languages}
                  selectedLang={selectedLang}
                  onSave={handleTranslationSave}
                />
              )}

              {activeTab === 'languages' && (
                <LanguageManager
                  languages={data.languages}
                  onChange={handleLanguageChange}
                  onDelete={async (id) => {
                    if (window.confirm('آیا از حذف این زبان اطمینان دارید؟')) {
                      await localizationService.deleteLanguage(id);
                      await fetchLocalizationData();
                    }
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
