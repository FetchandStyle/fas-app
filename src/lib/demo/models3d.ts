export type Model3DKind =
  | 'sofa'
  | 'chair'
  | 'table'
  | 'bookcase'
  | 'desk'
  | 'closet';

export interface Model3DConfig {
  kind: Model3DKind;
  glb: string;
  /** Uniform scale applied before item.scale */
  baseScale: number;
  yOffset: number;
}

/**
 * KayKit Furniture Bits (CC0) — cohesive textured low-poly set for the show demo.
 * Generated via: npm run setup-show-models
 */
const MODEL_CONFIG: Record<Model3DKind, Model3DConfig> = {
  sofa: {
    kind: 'sofa',
    glb: '/demo/models/sofa.glb',
    baseScale: 1.8,
    yOffset: 0,
  },
  chair: {
    kind: 'chair',
    glb: '/demo/models/chair.glb',
    baseScale: 1.6,
    yOffset: 0,
  },
  table: {
    kind: 'table',
    glb: '/demo/models/table.glb',
    baseScale: 1.8,
    yOffset: 0,
  },
  bookcase: {
    kind: 'bookcase',
    glb: '/demo/models/bookcase.glb',
    baseScale: 1.7,
    yOffset: 0.17,
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
};

const SKU_TO_KIND: Record<string, Model3DKind> = {
  'HEFTSB-3202': 'sofa',
  'HEFTSF-7730': 'sofa',
  'HEFTDC-5510': 'chair',
  'HEFTST-2201': 'chair',
  'HEFTCT-4410': 'table',
  'HEFTDT-8404': 'desk',
  'HEFTBS-6620': 'bookcase',
  'HEFTSD-8840': 'closet',
};

export function getModel3DForSku(sku: string): Model3DConfig {
  const kind = SKU_TO_KIND[sku] ?? 'chair';
  return MODEL_CONFIG[kind];
}

export const ALL_DEMO_GLB_PATHS = Object.values(MODEL_CONFIG).map((m) => m.glb);

/** Optional static room prop */
export const ROOM_RUG_GLB = '/demo/models/rug.glb';
