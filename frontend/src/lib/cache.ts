// src/lib/cache.ts
import { unstable_cache } from 'next/cache';

export const getCachedProducts = unstable_cache(
  async (page: number, category?: string) => {
    const products = await fetch(
      `/api/products?page=${page}&category=${category || ''}`
    ).then((res) => res.json());
    
    return products;
  },
  ['products'],
  {
    revalidate: 3600, // 1 hour
    tags: ['products']
  }
);