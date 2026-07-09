import { HERO_PRODUCT_SKU } from './config';
import type { Product } from '@/types';

/**
 * Hero product for the intelligence demo: Hernest "Magnus" round sintered-stone
 * dining table (31"). Used for search results, PDP, the AI Commerce Score, and
 * the before/after enrichment story.
 */
export const HERO_PRODUCT: Product = {
  sku: HERO_PRODUCT_SKU,
  name: 'Magnus 31" Round Sintered Stone Dining Table',
  description:
    'A compact round dining table with a sintered stone tabletop and a solid pedestal base. Seats 2 comfortably — ideal for apartments, breakfast nooks, and small dining spaces.',
  source: 'hernest',
  length: 31,
  width: 31,
  height: 30,
  price: 559,
  image_url: '/demo/products/HEFTDT-8404.jpg',
  score: 0.98,
};

/**
 * The "before" state — the raw retailer feed as it typically arrives.
 * Sparse, unstructured, poor for AI search / discovery.
 */
export const HERO_BEFORE = {
  title: 'Rolf 31" Brown Small Round Dining Table',
  fields: {
    Title: 'Rolf 31" Brown Small Round Dining Table',
    Price: '$559.00',
    Description: 'Round dining table. Stone top. Wood base.',
    Category: 'Dining Tables',
    Image: '1 image',
    Dimensions: '—',
    Material: '—',
    Style: '—',
    'Room / use case': '—',
    'Seating capacity': '—',
  },
  issues: [
    'Inconsistent title (does not match product family "Magnus")',
    'No structured dimensions — buyers can’t confirm fit',
    'No material, style, shape, or color attributes',
    'Description too short for AI/semantic search',
    'No room or use-case tags for recommendations',
  ],
};

/**
 * The "after" state — enriched, structured, AI-ready.
 */
export const HERO_AFTER = {
  title: 'Magnus 31" Round Sintered Stone Dining Table',
  fields: {
    Title: 'Magnus 31" Round Sintered Stone Dining Table',
    Price: '$559.00',
    Dimensions: 'Ø 31" × 30" H (79cm × 76cm)',
    'Seating capacity': 'Seats 2',
    Shape: 'Round',
    'Tabletop material': 'Sintered stone',
    'Base material': 'Rubberwood + engineered wood',
    'Base type': 'Pedestal',
    Color: 'White top / dark brown base',
    Style: 'Modern, Minimalist, Scandinavian',
    'Room / use case': 'Small dining room, apartment, breakfast nook',
    Description:
      'A compact round dining table with a durable sintered stone tabletop and a stable pedestal base. Its 31" diameter seats two comfortably, making it ideal for apartments, breakfast nooks, and small dining spaces. The neutral white top pairs with a warm dark-brown base for a modern, minimalist look.',
  },
  addedAttributes: 11,
};

/**
 * Precomputed AI Commerce Readiness Score for the hero product / catalog.
 * Mirrors the /readiness scoring dimensions.
 */
export const HERO_COMMERCE_SCORE = {
  overall: 74,
  grade: 'C+',
  dimensions: [
    { label: 'Structured data', before: 35, after: 92 },
    { label: 'AI search readiness', before: 40, after: 95 },
    { label: 'Dimensional data', before: 10, after: 100 },
    { label: 'Style & material tagging', before: 20, after: 90 },
    { label: 'Image assets', before: 55, after: 70 },
  ],
};
