// frontend/src/components/product/ProductGallery.tsx
import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, title }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* تصویر اصلی */}
      <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
        <Image
          src={images[selectedImage]}
          alt={`${title} - تصویر ${selectedImage + 1}`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* تصاویر کوچک */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 
              ${selectedImage === index ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setSelectedImage(index)}
          >
            <Image
              src={image}
              alt={`${title} - تصویر کوچک ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>
    </div>
  );
};