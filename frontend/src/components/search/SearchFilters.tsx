// frontend/src/components/search/SearchFilters.tsx
import { DateRangePicker } from '@/components/forms/DateRangePicker';
import { Checkbox } from '@/components/ui/Checkbox';
import { RadioGroup } from '@/components/ui/RadioGroup';

interface SearchFiltersProps {
  filters: any;
  onChange: (filters: any) => void;
  aggregations: any;
}

export const SearchFilters = ({
  filters,
  onChange,
  aggregations
}: SearchFiltersProps) => {
  const handleChange = (key: string, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Content Type Filter */}
      <div>
        <h3 className="text-lg font-medium mb-3">نوع محتوا</h3>
        <RadioGroup
          value={filters.type}
          onChange={(value) => handleChange('type', value)}
          options={[
            { label: 'همه', value: '' },
            { label: 'مقالات', value: 'post' },
            { label: 'محصولات', value: 'product' },
            { label: 'صفحات', value: 'page' }
          ]}
        />
      </div>

      {/* Categories Filter */}
      {aggregations.categories && (
        <div>
          <h3 className="text-lg font-medium mb-3">دسته‌بندی‌ها</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {aggregations.categories.map((category: any) => (
              <Checkbox
                key={category._id}
                label={`${category.name} (${category.count})`}
                checked={filters.category === category._id}
                onChange={() => handleChange('category', category._id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tags Filter */}
      {aggregations.tags && (
        <div>
          <h3 className="text-lg font-medium mb-3">برچسب‌ها</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {aggregations.tags.map((tag: any) => (
              <Checkbox
                key={tag._id}
                label={`${tag._id} (${tag.count})`}
                checked={filters.tags.includes(tag._id)}
                onChange={(checked) => {
                  const newTags = checked
                    ? [...filters.tags, tag._id]
                    : filters.tags.filter((t: string) => t !== tag._id);
                  handleChange('tags', newTags);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Date Range Filter */}
      <div>
        <h3 className="text-lg font-medium mb-3">بازه زمانی</h3>
        <DateRangePicker
          startDate={filters.dateRange.start}
          endDate={filters.dateRange.end}
          onChange={(start, end) => handleChange('dateRange', { start, end })}
        />
      </div>
    </div>
  );
};

