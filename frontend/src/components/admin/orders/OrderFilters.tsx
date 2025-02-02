
// frontend/src/components/admin/orders/OrderFilters.tsx
interface OrderFiltersProps {
    filters: {
      status: string;
      dateRange: string;
      search: string;
    };
    onChange: (filters: any) => void;
  }
  
  export const OrderFilters: React.FC<OrderFiltersProps> = ({ filters, onChange }) => {
    const handleChange = (field: string, value: string) => {
      onChange({ ...filters, [field]: value });
    };
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            وضعیت سفارش
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="">همه</option>
            <option value="processing">در حال پردازش</option>
            <option value="shipping">در حال ارسال</option>
            <option value="delivered">تحویل شده</option>
            <option value="canceled">لغو شده</option>
          </select>
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            بازه زمانی
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleChange('dateRange', e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="">همه</option>
            <option value="today">امروز</option>
            <option value="week">این هفته</option>
            <option value="month">این ماه</option>
          </select>
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            جستجو
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="شماره سفارش یا نام مشتری..."
            className="w-full border rounded-lg p-2"
          />
        </div>
      </div>
    );
  };
  