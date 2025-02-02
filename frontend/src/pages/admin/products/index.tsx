// frontend/src/pages/admin/products/index.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { DataTable } from '@/components/admin/DataTable';
import { productService } from '@/services/product.service';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  const columns = [
    {
      title: 'تصویر',
      key: 'image',
      render: (product) => (
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-16 h-16 object-cover rounded"
        />
      )
    },
    {
      title: 'نام محصول',
      key: 'title'
    },
    {
      title: 'دسته‌بندی',
      key: 'category'
    },
    {
      title: 'قیمت',
      key: 'price',
      render: (product) => (
        <span>{product.price.toLocaleString()} تومان</span>
      )
    },
    {
      title: 'موجودی',
      key: 'stock'
    },
    {
      title: 'عملیات',
      key: 'actions',
      render: (product) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(product._id)}
            className="text-blue-600 hover:text-blue-700"
          >
            ویرایش
          </button>
          <button
            onClick={() => handleDelete(product._id)}
            className="text-red-600 hover:text-red-700"
          >
            حذف
          </button>
        </div>
      )
    }
  ];

  useEffect(() => {
    fetchProducts();
  }, [pagination.page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts({
        page: pagination.page,
        limit: pagination.limit
      });
      setProducts(response.data.products);
      setPagination(prev => ({
        ...prev,
        total: response.data.total
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleEdit = (id: string) => {
    // پیاده‌سازی ویرایش محصول
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('آیا از حذف این محصول اطمینان دارید؟')) {
      try {
        await productService.deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">مدیریت محصولات</h1>
          <button
            onClick={() => router.push('/admin/products/new')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            افزودن محصول جدید
          </button>
        </div>

        <DataTable
          columns={columns}
          data={products}
          loading={loading}
          pagination={{
            current: pagination.page,
            total: pagination.total,
            pageSize: pagination.limit,
            onChange: handlePageChange
          }}
        />
      </div>
    </AdminLayout>
  );
}

// frontend/src/components/admin/DataTable.tsx
interface DataTableProps {
  columns: Array<{
    title: string;
    key: string;
    render?: (record: any) => React.ReactNode;
  }>;
  data: any[];
  loading?: boolean;
  pagination?: {
    current: number;
    total: number;
    pageSize: number;
    onChange: (page: number) => void;
  };
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  loading,
  pagination
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                در حال بارگذاری...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                داده‌ای یافت نشد
              </td>
            </tr>
          ) : (
            data.map((record, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? column.render(record) : record[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pagination && (
        <div className="flex justify-center mt-4">
          <Pagination
            current={pagination.current}
            total={pagination.total}
            pageSize={pagination.pageSize}
            onChange={pagination.onChange}
          />
        </div>
      )}
    </div>
  );
};