// backend/src/constants/categories.ts
export const ProductCategories = {
    FAUCETS: 'شیرآلات',
    SINKS: 'سینک',
    TOILETS: 'توالت فرنگی',
    BATHROOM_FIXTURES: 'لوازم حمام',
    MIRRORS: 'آینه و روشویی',
    BATHROOM_ACCESSORIES: 'اکسسوری حمام',
    PIPES_FITTINGS: 'لوله و اتصالات'
  } as const;
  
  export type ProductCategory = keyof typeof ProductCategories;