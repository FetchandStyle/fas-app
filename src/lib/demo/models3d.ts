export type Model3DKind = 'sofa' | 'chair' | 'table';

export interface Model3DConfig {
  kind: Model3DKind;
  glb: string;
  /** Uniform scale applied before item.scale */
  baseScale: number;
  yOffset: number;
}

const MODEL_CONFIG: Record<Model3DKind, Model3DConfig> = {
  sofa: {
    kind: 'sofa',
    glb: '/demo/models/sofa.glb',
    baseScale: 1.15,
    yOffset: 0,
  },
  chair: {
    kind: 'chair',
    glb: '/demo/models/chair.glb',
    baseScale: 0.9,
    yOffset: 0,
  },
  table: {
    kind: 'table',
    glb: '/demo/models/table.glb',
    baseScale: 1.4,
    yOffset: 0,
  },
};

const SKU_TO_KIND: Record<string, Model3DKind> = {
  'HEFTSB-3202': 'sofa',
  'HEFTSF-7730': 'sofa',
  'HEFTDC-5510': 'chair',
  'HEFTST-2201': 'chair',
  'HEFTCT-4410': 'table',
  'HEFTDT-8404': 'table',
  'HEFTBS-6620': 'table',
  'HEFTSD-8840': 'table',
};

export function getModel3DForSku(sku: string): Model3DConfig {
  const kind = SKU_TO_KIND[sku] ?? 'chair';
  return MODEL_CONFIG[kind];
}

export const ALL_DEMO_GLB_PATHS = Object.values(MODEL_CONFIG).map((m) => m.glb);
