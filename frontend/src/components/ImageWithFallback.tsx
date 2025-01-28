// src/components/ImageWithFallback.tsx
'use client'

import Image from 'next/image';
import { useState } from 'react';

interface ImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className,
}: ImageProps) {
  const [error, setError] = useState(false);

  return (
    <Image
      src={error ? '/images/fallback.png' : src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    />
  );
}