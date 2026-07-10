'use client';

import Image from 'next/image';
import { useState } from 'react';
import { PRODUCT_IMAGE_FALLBACK } from '@/lib/demo/productImages';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  objectFit?: 'cover' | 'contain';
}

export default function ProductImage({
  src,
  alt,
  className = '',
  fill = true,
  width,
  height,
  sizes,
  priority,
  objectFit = 'cover',
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const fitClass = objectFit === 'contain' ? 'object-contain' : 'object-cover';

  const handleError = () => {
    if (imgSrc !== PRODUCT_IMAGE_FALLBACK) {
      setImgSrc(PRODUCT_IMAGE_FALLBACK);
    }
  };

  if (!fill && width && height) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className={`${fitClass} ${className}`}
        onError={handleError}
      />
    );
  }

  return (
    <div className="relative h-full w-full">
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`${fitClass} ${className}`}
        onError={handleError}
      />
    </div>
  );
}
