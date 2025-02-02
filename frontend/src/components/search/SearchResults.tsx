// frontend/src/components/search/SearchResults.tsx
import { ContentCard } from '@/components/content/ContentCard';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';

interface SearchResultsProps {
  results: any[];
  loading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  total: number;
}

export const SearchResults = ({
  results,
  loading,
  page,
  onPageChange,
  total
}: SearchResultsProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">نتیجه‌ای یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {results.map((item) => (
          <ContentCard
            key={item._id}
            content={item}
            highlight={true}
          />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={Math.ceil(total / 10)}
        onPageChange={onPageChange}
      />
    </div>
  );
};

