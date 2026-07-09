import type { Product } from '@/types';
import { HERO_PRODUCT } from './heroProduct';

/**
 * Curated, offline-safe demo catalog (Hernest-style products).
 *
 * The hero product is always first. The rest give the results grid enough
 * variety to look real. Image paths are LOCAL (/demo/products/<sku>.jpg) so
 * the demo works with no Wi-Fi — see scripts/README for how to populate them.
 *
 * TODO(before show): replace the non-hero entries with real rows pulled from
 * the Hernest feed via fas-api/scripts/export_to_csv.py, and download their
 * images into public/demo/products/.
 */
export const DEMO_CATALOG: Product[] = [
  HERO_PRODUCT,
  {
    sku: 'HEFTST-2201',
    name: 'Oslo Round Side Table with Storage Shelf',
    description:
      'Compact round side table with an open lower shelf. Solid wood legs and a smooth matte top — perfect beside a sofa or bed.',
    source: 'hernest',
    length: 18,
    width: 18,
    height: 22,
    price: 149,
    image_url: '/demo/products/HEFTST-2201.jpg',
    score: 0.91,
  },
  {
    sku: 'HEFTSB-3202',
    name: 'Lund 3-Seater Convertible Sofa Bed',
    description:
      'A modern convertible sofa that folds flat into a bed. Upholstered in soft linen-blend fabric with a sturdy wood frame.',
    source: 'hernest',
    length: 78,
    width: 33,
    height: 31,
    price: 899,
    image_url: '/demo/products/HEFTSB-3202.jpg',
    score: 0.89,
  },
  {
    sku: 'HEFTCT-4410',
    name: 'Bergen Oval Sintered Stone Coffee Table',
    description:
      'An oval coffee table with a sintered stone top and sculptural base. Pairs with the Magnus dining collection.',
    source: 'hernest',
    length: 47,
    width: 24,
    height: 16,
    price: 429,
    image_url: '/demo/products/HEFTCT-4410.jpg',
    score: 0.88,
  },
  {
    sku: 'HEFTDC-5510',
    name: 'Ari Upholstered Dining Chair (Set of 2)',
    description:
      'Set of two upholstered dining chairs with metal legs and a curved backrest. Coordinates with the Magnus dining table.',
    source: 'hernest',
    length: 20,
    width: 22,
    height: 32,
    price: 259,
    image_url: '/demo/products/HEFTDC-5510.jpg',
    score: 0.86,
  },
  {
    sku: 'HEFTBS-6620',
    name: 'Nord 3-Tier Bookshelf',
    description:
      'Open three-tier bookshelf in warm oak finish. Slim footprint for small living rooms and home offices.',
    source: 'hernest',
    length: 31,
    width: 12,
    height: 42,
    price: 199,
    image_url: '/demo/products/HEFTBS-6620.jpg',
    score: 0.83,
  },
  {
    sku: 'HEFTSF-7730',
    name: 'Faro 2-Seater Boucle Accent Sofa',
    description:
      'A cozy two-seater accent sofa in textured boucle fabric with tapered wood legs.',
    source: 'hernest',
    length: 60,
    width: 32,
    height: 30,
    price: 749,
    image_url: '/demo/products/HEFTSF-7730.jpg',
    score: 0.81,
  },
  {
    sku: 'HEFTSD-8840',
    name: 'Vika Modern Sideboard Cabinet',
    description:
      'A low sideboard with fluted door fronts and adjustable shelving — ideal for dining and living rooms.',
    source: 'hernest',
    length: 55,
    width: 16,
    height: 30,
    price: 519,
    image_url: '/demo/products/HEFTSD-8840.jpg',
    score: 0.79,
  },
];

const HERO_KEYWORDS = ['magnus', 'dining', 'table', 'round', 'stone', 'kitchen', 'eat'];

/**
 * Local, deterministic "search" for demo mode. Ranks the hero product first
 * for likely dining/table queries, otherwise returns the curated catalog.
 * Always returns results — never fails, never needs network.
 */
export function demoSearch(query: string, limit = 50): Product[] {
  const q = (query || '').trim().toLowerCase();

  if (!q) return DEMO_CATALOG.slice(0, limit);

  const scored = DEMO_CATALOG.map((p) => {
    const haystack = `${p.name} ${p.description}`.toLowerCase();
    let s = 0;
    for (const word of q.split(/\s+/)) {
      if (word && haystack.includes(word)) s += 2;
    }
    if (HERO_KEYWORDS.some((k) => q.includes(k)) && p.sku === HERO_PRODUCT.sku) {
      s += 5;
    }
    return { p, s };
  });

  const matches = scored
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.p);

  // Fall back to the full catalog so the grid is never empty in a demo.
  return (matches.length ? matches : DEMO_CATALOG).slice(0, limit);
}

export function demoProductBySku(sku: string): Product | null {
  return DEMO_CATALOG.find((p) => p.sku === sku) ?? null;
}
