// frontend/src/components/search/AdvancedSearch.tsx
import { useState, useEffect } from 'react';
import { SearchFilters } from './SearchFilters';
import { SearchResults } from './SearchResults';
import { useDebounce } from '@/hooks/useDebounce';
import { searchService } from '@/services/search.service';

export const AdvancedSearch = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    tags: [],
    dateRange: {
      start: '',
      end: ''
    }
  });
  const [results, setResults] = useState<any>({
    content: [],
    categories: [],
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [suggestions, setSuggestions] = useState([]);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    search();
  }, [debouncedQuery, filters, page]);

  const fetchSuggestions = async () => {
    try {
      const response = await searchService.suggest(debouncedQuery);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const search = async () => {
    try {
      setLoading(true);
      const response = await searchService.advancedSearch({
        query: debouncedQuery,
        filters,
        page,
        aggregations: ['categories', 'tags']
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input with Auto-suggest */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو..."
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
            {suggestions.map((suggestion: any) => (
              <div
                key={suggestion._id}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setQuery(suggestion.title);
                  setSuggestions([]);
                }}
              >
                <div className="font-medium">{suggestion.title}</div>
                <div className="text-sm text-gray-500">
                  {suggestion.type} • {suggestion.tags.join(', ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <SearchFilters
            filters={filters}
            onChange={setFilters}
            aggregations={results}
          />
        </div>

        {/* Search Results */}
        <div className="lg:col-span-3">
          <SearchResults
            results={results.content}
            loading={loading}
            page={page}
            onPageChange={setPage}
            total={results.total}
          />
        </div>
      </div>
    </div>
  );
};

