// frontend/src/pages/admin/seo/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { MetaTagEditor } from '@/components/admin/seo/MetaTagEditor';
import { SitemapManager } from '@/components/admin/seo/SitemapManager';
import { KeywordTracker } from '@/components/admin/seo/KeywordTracker';
import { seoService } from '@/services/seo.service';

export default function AdminSEO() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    pages: [],
    keywords: [],
    stats: {}
  });
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    search: ''
  });

  const tabs = [
    { id: 'overview', label: 'نمای کلی' },
    { id: 'meta-tags', label: 'متاتگ‌ها' },
    { id: 'sitemap', label: 'نقشه سایت' },
    { id: 'keywords', label: 'کلمات کلیدی' },
    { id: 'analytics', label: 'تحلیل‌ها' }
  ];

  useEffect(() => {
    fetchSEOData();
  }, [activeTab, filters]);

  const fetchSEOData = async () => {
    try {
      setLoading(true);
      const response = await seoService.getData({
        tab: activeTab,
        filters
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching SEO data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">مدیریت سئو و بهینه‌سازی</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                <span className="text-sm text-blue-800">
                  امتیاز سئو: {data.stats?.seoScore || 0}/100
                </span>
              </div>
              <button
                onClick={() => setActiveTab('keywords')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                افزودن کلمه کلیدی
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
          {activeTab === 'overview' && (
            <SEOOverview 
              stats={data.stats}
              issues={data.issues}
              onFixIssue={async (issueId) => {
                await seoService.fixIssue(issueId);
                await fetchSEOData();
              }}
            />
          )}

          {activeTab === 'meta-tags' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* لیست صفحات */}
              <div className="lg:col-span-2">
                <div className="mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="جستجوی صفحه..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      className="border rounded-lg p-2"
                    />
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                      className="border rounded-lg p-2"
                    >
                      <option value="all">همه انواع</option>
                      <option value="product">محصولات</option>
                      <option value="category">دسته‌بندی‌ها</option>
                      <option value="blog">مقالات</option>
                      <option value="static">صفحات ثابت</option>
                    </select>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="border rounded-lg p-2"
                    >
                      <option value="all">همه وضعیت‌ها</option>
                      <option value="optimized">بهینه شده</option>
                      <option value="needs_review">نیاز به بررسی</option>
                      <option value="issues">دارای مشکل</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white rounded-lg border">
                  {data.pages.map((page: any) => (
                    <div
                      key={page.id}
                      className="p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedPage(page)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{page.title}</h3>
                          <p className="text-sm text-gray-500">{page.url}</p>
                          <div className="mt-2 flex items-center gap-4">
                            <span className={`
                              px-2 py-1 rounded-full text-xs
                              ${page.seoScore >= 80 ? 'bg-green-100 text-green-800' :
                                page.seoScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'}
                            `}>
                              امتیاز: {page.seoScore}
                            </span>
                            <span className="text-sm text-gray-500">
                              {page.type === 'product' ? 'محصول' :
                               page.type === 'category' ? 'دسته‌بندی' :
                               page.type === 'blog' ? 'مقاله' : 'صفحه ثابت'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ویرایشگر متاتگ */}
              <div className="lg:col-span-1">
                {selectedPage && (
                  <MetaTagEditor
                    page={selectedPage}
                    onSave={async (data) => {
                      await seoService.updateMetaTags(selectedPage.id, data);
                      await fetchSEOData();
                    }}
                    onCancel={() => setSelectedPage(null)}
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === 'sitemap' && (
            <SitemapManager
              sitemaps={data.sitemaps}
              onGenerate={async () => {
                await seoService.generateSitemap();
                await fetchSEOData();
              }}
              onSubmit={async (engines) => {
                await seoService.submitSitemap(engines);
                await fetchSEOData();
              }}
            />
          )}

          {activeTab === 'keywords' && (
            <KeywordTracker
              keywords={data.keywords}
              onAdd={async (keyword) => {
                await seoService.addKeyword(keyword);
                await fetchSEOData();
              }}
              onUpdate={async (id, data) => {
                await seoService.updateKeyword(id, data);
                await fetchSEOData();
              }}
              onDelete={async (id) => {
                if (window.confirm('آیا از حذف این کلمه کلیدی اطمینان دارید؟')) {
                  await seoService.deleteKeyword(id);
                  await fetchSEOData();
                }
              }}
            />
          )}

          {activeTab === 'analytics' && (
            <SEOAnalytics
              stats={data.stats}
              dateRange={data.dateRange}
              onDateRangeChange={async (range) => {
                const response = await seoService.getAnalytics(range);
                setData(prev => ({ ...prev, stats: response.data }));
              }}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}