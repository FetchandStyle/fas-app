export type Model3DKind =
  | 'sofa'
  | 'lund'
  | 'chair'
  | 'ari'
  | 'table'
  | 'bergen'
  | 'magnus'
  | 'oslo'
  | 'bookcase'
  | 'nord'
  | 'desk'
  | 'closet'
  | 'vika';

export interface Model3DConfig {
  kind: Model3DKind;
  glb: string;
  /** Uniform scale applied before item.scale */
  baseScale: number;
  yOffset: number;
}

/**
 * KayKit Furniture Bits (CC0) + generated Magnus hero table.
 * KayKit: npm run setup-show-models · Magnus: npm run generate-magnus-table
 */
const MODEL_CONFIG: Record<Model3DKind, Model3DConfig> = {
  sofa: {
    kind: 'sofa',
    glb: '/demo/models/sofa.glb',
    baseScale: 1.8,
    yOffset: 0,
  },
  lund: {
    kind: 'lund',
    glb: '/demo/models/lund-sofa.glb',
    baseScale: 2.2,
    yOffset: 0,
  },
  chair: {
    kind: 'chair',
    glb: '/demo/models/chair.glb',
    baseScale: 1.6,
    yOffset: 0,
  },
  ari: {
    kind: 'ari',
    glb: '/demo/models/ari-chair.glb',
    baseScale: 2,
    yOffset: 0,
  },
  table: {
    kind: 'table',
    glb: '/demo/models/table.glb',
    baseScale: 1.8,
    yOffset: 0,
  },
  bergen: {
    kind: 'bergen',
    glb: '/demo/models/bergen-table.glb',
    baseScale: 2,
    yOffset: 0,
  },
  magnus: {
    kind: 'magnus',
    glb: '/demo/models/magnus-table.glb',
    baseScale: 2,
    yOffset: 0,
  },
  oslo: {
    kind: 'oslo',
    glb: '/demo/models/oslo-side-table.glb',
    baseScale: 1.8,
    yOffset: 0,
  },
  bookcase: {
    kind: 'bookcase',
    glb: '/demo/models/bookcase.glb',
    baseScale: 1.7,
    yOffset: 0.17,
  },
  nord: {
    kind: 'nord',
    glb: '/demo/models/nord-bookshelf.glb',
    baseScale: 2.2,
    yOffset: 0,
  },
  desk: {
    kind: 'desk',
    glb: '/demo/models/desk.glb',
    baseScale: 1.6,
    yOffset: 0,
  },
  closet: {
    kind: 'closet',
    glb: '/demo/models/closet.glb',
    baseScale: 1.7,
    yOffset: 0,
  },
  vika: {
    kind: 'vika',
    glb: '/demo/models/vika-sideboard.glb',
    baseScale: 2.2,
    yOffset: 0,
  },
};

const SKU_TO_KIND: Record<string, Model3DKind> = {
  'HEFTSB-3202': 'lund',
  'HEFTSF-7730': 'sofa',
  'HEFTDC-5510': 'ari',
  'HEFTST-2201': 'oslo',
  'HEFTCT-4410': 'bergen',
  'HEFTDT-8404': 'magnus',
  'HEFTBS-6620': 'nord',
  'HEFTSD-8840': 'vika',
};

export function getModel3DForSku(sku: string): Model3DConfig {
  const kind = SKU_TO_KIND[sku] ?? 'chair';
  return MODEL_CONFIG[kind];
}

export const ALL_DEMO_GLB_PATHS = Object.values(MODEL_CONFIG).map((m) => m.glb);

/** Optional static room prop */
export const ROOM_RUG_GLB = '/demo/models/rug.glb';
