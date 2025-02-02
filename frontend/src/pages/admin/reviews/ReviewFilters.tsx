// frontend/src/components/admin/reviews/ReviewFilters.tsx
interface ReviewFiltersProps {
    filters: {
      status: string;
      rating: string;
      search: string;
    };
    onChange: (filters: any) => void;
  }
  
  export const ReviewFilters: React.FC<ReviewFiltersProps> = ({ filters, onChange }) => {
    const handleChange = (field: string, value: string) => {
      onChange({ ...filters, [field]: value });
    };
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            وضعیت
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="">همه</option>
            <option value="pending">در انتظار تایید</option>
            <option value="approved">تایید شده</option>
            <option value="rejected">رد شده</option>
          </select>
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            امتیاز
          </label>
          <select
            value={filters.rating}
            onChange={(e) => handleChange('rating', e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="">همه</option>
            <option value="5">5 ستاره</option>
            <option value="4">4 ستاره</option>
            <option value="3">3 ستاره</option>
            <option value="2">2 ستاره</option>
            <option value="1">1 ستاره</option>
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
            placeholder="نام محصول یا کاربر..."
            className="w-full border rounded-lg p-2"
          />
        </div>
      </div>
    );
  };