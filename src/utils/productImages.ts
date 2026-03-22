import { Product } from '../types';

/** Gallery URLs (max 3); falls back to single `image` for older data. */
export function getProductImages(product: Product): string[] {
  const extra = product.images?.filter(Boolean) ?? [];
  if (extra.length > 0) return extra.slice(0, 3);
  return product.image ? [product.image] : [];
}
