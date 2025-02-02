// frontend/src/components/admin/dashboard/ProductsTable.tsx
interface ProductsTableProps {
    products: Array<{
      _id: string;
      title: string;
      image: string;
      sales: number;
      revenue: number;
      stock: number;
    }>;
  }
  
  export const ProductsTable: React.FC<ProductsTableProps> = ({ products }) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                محصول
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                تعداد فروش
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                درآمد
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                موجودی
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-10 h-10 rounded-lg object-cover ml-3"
                    />
                    <span className="text-sm">{product.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {new Intl.NumberFormat('fa-IR').format(product.sales)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {new Intl.NumberFormat('fa-IR').format(product.revenue)} تومان
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      product.stock > 10
                        ? 'bg-green-100 text-green-800'
                        : product.stock > 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.stock} عدد
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };