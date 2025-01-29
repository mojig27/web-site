// frontend/src/pages/products/[id].tsx
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { api } from '@/lib/api/client';
import { IProduct } from '@/types/product';
import { useCart } from '@/hooks/useCart';
import { toast } from 'react-hot-toast';

interface ProductPageProps {
  product: IProduct;
  relatedProducts: IProduct[];
}

export default function ProductPage({ product, relatedProducts }: ProductPageProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success('محصول به سبد خرید اضافه شد');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <ProductGallery
          images={product.images}
          title={product.title}
        />
        <ProductInfo
          product={product}
          onAddToCart={handleAddToCart}
        />
      </div>

      {/* توضیحات محصول */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">توضیحات محصول</h2>
        <div className="prose max-w-none">
          {product.description}
        </div>
      </div>

      {/* محصولات مرتبط */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">محصولات مرتبط</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct._id}
                product={relatedProduct}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const [productRes, relatedRes] = await Promise.all([
      api.get<{ data: IProduct }>(`/products/${params?.id}`),
      api.get<{ data: IProduct[] }>(`/products/${params?.id}/related`)
    ]);

    return {
      props: {
        product: productRes.data,
        relatedProducts: relatedRes.data
      }
    };
  } catch (error) {
    return {
      notFound: true
    };
  }
};