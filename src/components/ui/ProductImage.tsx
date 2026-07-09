'use client';

import Image from 'next/image';
import { useState } from 'react';
import { PRODUCT_IMAGE_FALLBACK } from '@/lib/demo/productImages';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  objectFit?: 'cover' | 'contain';
}

export default function ProductImage({
  src,
  alt,
  className = '',
  fill = true,
  sizes,
  priority,
  objectFit = 'cover',
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={`${objectFit === 'contain' ? 'object-contain' : 'object-cover'} ${className}`}
      onError={() => {
        if (imgSrc !== PRODUCT_IMAGE_FALLBACK) {
          setImgSrc(PRODUCT_IMAGE_FALLBACK);
        }
      }}
    />
  );
}
