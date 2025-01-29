// frontend/src/pages/admin/products/index.tsx
import { useState } from 'react';
import Link from 'next/link';
import { useProducts } from '@/hooks/useProducts';
import { formatPrice } from '@/utils/format';

export default function ProductsManagement() {
  const [page, setPage] = useState(1);
  const { products, loading, error } = useProducts({ page });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مدیریت محصولات</h1>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          افزودن محصول جدید
        </Link>
      </div>

      {/* جستجو و فیلتر */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="جستجو در محصولات..."
          className="w-full md:w-1/3 p-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* لیست محصولات */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">تصویر</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">نام محصول</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">برند</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">قیمت</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">موجودی</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4">{product.title}</td>
                <td className="px-6 py-4">{product.brand}</td>
                <td className="px-6 py-4">{formatPrice(product.price)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    product.stock > 10
                      ? 'bg-green-100 text-green-800'
                      : product.stock > 0
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/${product._id}/edit`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ویرایش
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* صفحه‌بندی */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded-l hover:bg-gray-50 disabled:bg-gray-100"
        >
          قبلی
        </button>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={products.length < 10}
          className="px-4 py-2 border-t border-b border-r rounded-r hover:bg-gray-50 disabled:bg-gray-100"
        >
          بعدی
        </button>
      </div>
    </div>
  );
}