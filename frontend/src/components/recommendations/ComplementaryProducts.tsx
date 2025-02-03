// frontend/src/components/recommendations/ComplementaryProducts.tsx
import { useState, useEffect } from 'react';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useRecommendation } from '@/hooks/useRecommendation';

export const ComplementaryProducts: React.FC<{
  productId: string;
  projectType?: string;
}> = ({ productId, projectType }) => {
  const [packages, setPackages] = useState<any[]>([]);
  const { recommendations: complementary } = useRecommendation({
    type: 'complementary',
    productId,
    projectType
  });

  return (
    <div className="space-y-6">
      {/* پیشنهاد پکیج‌های کامل */}
      <div>
        <h3 className="text-lg font-semibold mb-4">پکیج‌های پیشنهادی</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packages.map(pkg => (
            <PackageCard
              key={pkg.id}
              package={pkg}
              onAddToCart={() => handleAddPackageToCart(pkg)}
            />
          ))}
        </div>
      </div>

      {/* محصولات مکمل */}
      <div>
        <h3 className="text-lg font-semibold mb-4">محصولات تکمیلی</h3>
        <ProductGrid products={complementary} />
      </div>
    </div>
  );
};
