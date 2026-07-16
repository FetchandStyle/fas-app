'use client';

import Image, { type ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

/**
 * Client-only Next/Image — renders a sized placeholder on SSR/first paint, then
 * swaps to Image after mount. Avoids Next 16 SSR adding filter:blur(0px) that
 * the client does not reproduce (hydration mismatch).
 */
export default function AppImage({
  className,
  style,
  width,
  height,
  alt,
  ...props
}: ImageProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        aria-hidden
        className={className}
        style={{
          display: 'inline-block',
          width: typeof width === 'number' ? width : undefined,
          height: typeof height === 'number' ? height : undefined,
          ...style,
        }}
      />
    );
  }

  return (
    <Image
      alt={alt}
      width={width}
      height={height}
      className={className}
      placeholder="empty"
      style={{ color: 'transparent', ...style }}
      {...props}
    />
  );
}
