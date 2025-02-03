
// frontend/src/components/recommendations/SmartRecommendations.tsx
import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import { useRecommendation } from '@/hooks/useRecommendation';
import { Tabs } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/Skeleton';

export const SmartRecommendations: React.FC<{
  userId: string;
  currentProduct?: string;
  category?: string;
}> = ({ userId, currentProduct, category }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const { recommendations, loading, error } = useRecommendation({
    userId,
    currentProduct,
    category,
    type: activeTab
  });

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        خطا در دریافت پیشنهادات
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        items={[
          { value: 'personal', label: 'پیشنهادات شخصی' },
          { value: 'similar', label: 'محصولات مشابه' },
          { value: 'complementary', label: 'محصولات مکمل' }
        ]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))
        ) : (
          recommendations.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onInteraction={(type) => trackInteraction(userId, product.id, type)}
            />
          ))
        )}
      </div>
    </div>
  );
};

