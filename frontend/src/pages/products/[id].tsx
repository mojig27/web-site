// frontend/src/pages/products/[id].tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Product } from '@/types';
import { productService } from '@/services/product.service';
import { formatPrice } from '@/utils/format';
import { AddToCart } from '@/components/cart';
import { ProductGallery, ProductSpecs, RelatedProducts } from '@/components/products';
import '@/styles/print.css';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProduct(id as string);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const response = await productService.getProduct(productId);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return <div>محصول یافت نشد</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* گالری تصاویر */}
        <div className="relative">
          <ProductGallery
            images={product.images}
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
          />
        </div>

        {/* اطلاعات محصول */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{product.title}</h1>
          
          <div className="flex items-center mb-4">
            <div className="text-sm text-gray-600 ml-4">برند: {product.brand}</div>
            <div className="text-sm text-gray-600">دسته‌بندی: {product.category}</div>
          </div>

          {/* قیمت و تخفیف */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            {product.discount?.percentage > 0 ? (
              <div>
                <span className="text-gray-400 line-through text-lg">
                  {formatPrice(product.price)}
                </span>
                <div className="flex items-center mt-2">
                  <span className="text-2xl font-bold text-red-500">
                    {formatPrice(product.price * (1 - product.discount.percentage / 100))}
                  </span>
                  <span className="mr-2 bg-red-100 text-red-800 px-2 py-1 rounded">
                    {product.discount.percentage}% تخفیف
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* وضعیت موجودی و دکمه خرید */}
          <div className="mb-6">
            <div className={`text-sm mb-2 ${
              product.stock > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {product.stock > 0 ? `${product.stock} عدد موجود در انبار` : 'ناموجود'}
            </div>
            <AddToCart
              product={product}
              disabled={product.stock === 0}
            />
          </div>

          {/* گارانتی */}
          {product.warranty && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">گارانتی محصول</h3>
              <p className="text-blue-700">
                {product.warranty.months} ماه گارانتی {product.warranty.description}
              </p>
            </div>
          )}

          {/* مشخصات فنی */}
          <ProductSpecs specifications={product.specifications} />
        </div>
      </div>

      {/* توضیحات محصول */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">توضیحات محصول</h2>
        <div className="prose max-w-none">
          {product.description}
        </div>
      </div>

      {/* محصولات مرتبط */}
      <RelatedProducts
        productId={product._id}
        category={product.category}
      />
    </div>
  );
}

// frontend/src/components/products/ProductGallery.tsx
interface ProductGalleryProps {
  images: string[];
  selectedImage: number;
  onImageSelect: (index: number) => void;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  selectedImage,
  onImageSelect
}) => {
  return (
    <div>
      <div className="relative h-[400px] mb-4">
        <Image
          src={images[selectedImage]}
          alt="تصویر محصول"
          fill
          className="object-contain rounded-lg"
        />
      </div>
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => onImageSelect(index)}
            className={`relative h-20 border-2 rounded-md overflow-hidden ${
              selectedImage === index ? 'border-blue-500' : 'border-gray-200'
            }`}
          >
            <Image
              src={image}
              alt={`تصویر ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

// frontend/src/components/products/ProductSpecs.tsx
interface ProductSpecsProps {
  specifications: Record<string, string | number>;
}

export const ProductSpecs: React.FC<ProductSpecsProps> = ({ specifications }) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <h3 className="font-semibold bg-gray-50 p-4 border-b">مشخصات فنی</h3>
      <div className="divide-y">
        {Object.entries(specifications).map(([key, value]) => (
          <div key={key} className="grid grid-cols-3 p-4">
            <span className="text-gray-600">{key}</span>
            <span className="col-span-2">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};