// src/components/ProductList.tsx
'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import ProductCard from './ProductCard';

export default function ProductList() {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(`/api/products?page=${pageParam}&limit=12`);
      return res.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {status === 'pending' ? (
        <div>در حال بارگذاری...</div>
      ) : status === 'error' ? (
        <div>خطا در بارگذاری محصولات</div>
      ) : (
        <>
          {data.pages.map((page) =>
            page.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
          <div ref={ref} className="col-span-full h-10">
            {isFetchingNextPage && <div>بارگذاری محصولات بیشتر...</div>}
          </div>
        </>
      )}
    </div>
  );
}