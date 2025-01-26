// frontend/src/components/products/ProductCard.tsx
import { FC } from 'react';
import { ProductCardProps } from '@/types/components';
import { Button } from '@/components/common/Button';
import { formatPrice } from '@/lib/utils';

export const ProductCard: FC<ProductCardProps> = ({
  product,
  onAddToCart
}) => {
  const { id, title, price, image, description, isAvailable } = product;

  return (
    <div className="group relative rounded-lg border p-4 space-y-3">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
        />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
        <p className="text-lg font-semibold text-gray-900">
          {formatPrice(price)}
        </p>
      </div>
      <Button
        variant="primary"
        fullWidth
        disabled={!isAvailable}
        onClick={() => onAddToCart?.(id)}
      >
        {isAvailable ? 'افزودن به سبد خرید' : 'ناموجود'}
      </Button>
    </div>
  );
};