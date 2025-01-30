// src/hooks/useProductFilters.ts
export const useProductFilters = () => {
    const [filters, setFilters] = useState({
      category: '',
      priceRange: { min: 0, max: 0 },
      brands: [] as string[],
      colors: [] as string[],
      materials: [] as string[],
      inStock: false,
      hasDiscount: false,
      sortBy: 'newest'
    });
  
    const updateFilters = (newFilters: Partial<typeof filters>) => {
      setFilters(prev => ({ ...prev, ...newFilters }));
    };
  
    return { filters, updateFilters };
  };