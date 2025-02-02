// frontend/src/pages/admin/digital-products/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { DigitalProductEditor } from '@/components/admin/digital/DigitalProductEditor';
import { LicenseManager } from '@/components/admin/digital/LicenseManager';
import { DownloadStats } from '@/components/admin/digital/DownloadStats';
import { digitalProductService } from '@/services/digital-product.service';

export default function AdminDigitalProducts() {
  const [activeTab, setActiveTab] = useState('products');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    products: [],
    licenses: [],
    stats: {}
  });
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    priceRange: 'all',
    search: ''
  });

  const tabs = [
    { id: 'products', label: 'محصولات دیجیتال' },
    { id: 'licenses', label: 'مدیریت لایسنس‌ها' },
    { id: 'downloads', label: 'آمار دانلودها' },
    { id: 'updates', label: 'به‌روزرسانی‌ها' }
  ];

  useEffect(() => {
    fetchProductData();
  }, [activeTab, filters]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await digitalProductService.getData({
        tab: activeTab,
        filters
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching digital product data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">مدیریت محصولات دیجیتال</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedProduct({})}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                افزودن محصول جدید
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
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="جستجو..."
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
                <option value="software">نرم‌افزار</option>
                <option value="ebook">کتاب الکترونیک</option>
                <option value="audio">فایل صوتی</option>
                <option value="video">ویدیو</option>
                <option value="graphics">فایل گرافیکی</option>
              </select>
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                className="border rounded-lg p-2"
              >
                <option value="all">همه قیمت‌ها</option>
                <option value="free">رایگان</option>
                <option value="0-100000">0 تا 100,000 تومان</option>
                <option value="100000-500000">100,000 تا 500,000 تومان</option>
                <option value="500000+">بالای 500,000 تومان</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="border rounded-lg p-2"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="active">فعال</option>
                <option value="draft">پیش‌نویس</option>
                <option value="archived">آرشیو شده</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* لیست محصولات */}
            <div className="lg:col-span-2">
              {activeTab === 'products' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.products.map((product: any) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="aspect-video rounded-lg bg-gray-100 mb-4">
                        {product.thumbnail && (
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        )}
                      </div>
                      <h3 className="font-medium mb-2">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-4">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">
                          {product.price === 0 ? 'رایگان' : `${product.price} تومان`}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {product.downloads} دانلود
                          </span>
                          <span className={`
                            px-2 py-1 rounded-full text-xs
                            ${product.status === 'active' ? 'bg-green-100 text-green-800' :
                              product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'}
                          `}>
                            {product.status === 'active' ? 'فعال' :
                             product.status === 'draft' ? 'پیش‌نویس' : 'آرشیو شده'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'licenses' && (
                <LicenseManager
                  licenses={data.licenses}
                  onUpdate={async (id, data) => {
                    await digitalProductService.updateLicense(id, data);
                    await fetchProductData();
                  }}
                  onDelete={async (id) => {
                    if (window.confirm('آیا از حذف این لایسنس اطمینان دارید؟')) {
                      await digitalProductService.deleteLicense(id);
                      await fetchProductData();
                    }
                  }}
                />
              )}

              {activeTab === 'downloads' && (
                <DownloadStats stats={data.stats} />
              )}

              {activeTab === 'updates' && (
                <UpdateManager
                  updates={data.updates}
                  products={data.products}
                  onPublish={async (data) => {
                    await digitalProductService.publishUpdate(data);
                    await fetchProductData();
                  }}
                />
              )}
            </div>

            {/* فرم ویرایش محصول */}
            <div className="lg:col-span-1">
              {selectedProduct && (
                <DigitalProductEditor
                  product={selectedProduct}
                  onSave={async (data) => {
                    if (data.id) {
                      await digitalProductService.updateProduct(data.id, data);
                    } else {
                      await digitalProductService.createProduct(data);
                    }
                    setSelectedProduct(null);
                    await fetchProductData();
                  }}
                  onCancel={() => setSelectedProduct(null)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}