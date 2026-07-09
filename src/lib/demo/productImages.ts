export function localProductImage(sku: string): string {
  return `/demo/products/${sku}.jpg`;
}

export const PRODUCT_IMAGE_FALLBACK = '/demo/products/fallback.svg';
