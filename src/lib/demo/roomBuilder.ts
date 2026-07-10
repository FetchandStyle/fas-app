import { DEMO_ROOM_SCANS } from '@/lib/demo/dashboard';
import { DEMO_CATALOG } from '@/lib/demo/catalog';
import type { Product } from '@/types';

export interface PlacedItem {
  id: string;
  sku: string;
  /** Floor position % (0–100) */
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface RoomScene {
  scanId: string;
  placedItems: PlacedItem[];
  savedAt?: string;
}

export interface RoomDimensions {
  width: number;
  depth: number;
  height: number;
}

export const ROOM_SCENES_STORAGE_KEY = 'fas-demo-room-scenes';

export const ROOM_DIMENSIONS: Record<string, RoomDimensions> = {
  'scan-1': { width: 18, depth: 14, height: 9 },
  'scan-2': { width: 16, depth: 14, height: 9 },
  'scan-3': { width: 12, depth: 10, height: 9 },
};

export const ROOM_BUILDER_PRODUCTS: Product[] = DEMO_CATALOG;

const DEFAULT_SCENES: Record<string, PlacedItem[]> = {
  'scan-3': [
    { id: 'd1', sku: 'HEFTSF-7730', x: 28, y: 42, scale: 1, rotation: 0 },
    { id: 'd2', sku: 'HEFTCT-4410', x: 52, y: 55, scale: 0.9, rotation: 0 },
    { id: 'd3', sku: 'HEFTST-2201', x: 72, y: 48, scale: 0.75, rotation: 15 },
    { id: 'd4', sku: 'HEFTBS-6620', x: 78, y: 28, scale: 0.85, rotation: 0 },
    { id: 'd5', sku: 'HEFTSD-8840', x: 22, y: 68, scale: 0.9, rotation: -5 },
    { id: 'd6', sku: 'HEFTDC-5510', x: 58, y: 72, scale: 0.7, rotation: 0 },
  ],
  'scan-1': [
    { id: 'd1', sku: 'HEFTSB-3202', x: 35, y: 45, scale: 1, rotation: 0 },
    { id: 'd2', sku: 'HEFTCT-4410', x: 58, y: 58, scale: 0.85, rotation: 0 },
    { id: 'd3', sku: 'HEFTST-2201', x: 72, y: 42, scale: 0.75, rotation: 0 },
  ],
  'scan-2': [
    { id: 'd1', sku: 'HEFTSF-7730', x: 40, y: 48, scale: 0.95, rotation: -3 },
    { id: 'd2', sku: 'HEFTDT-8404', x: 55, y: 62, scale: 0.8, rotation: 0 },
    { id: 'd3', sku: 'HEFTST-2201', x: 70, y: 50, scale: 0.7, rotation: 0 },
  ],
};

export function getScanById(scanId: string) {
  return DEMO_ROOM_SCANS.find((s) => s.id === scanId) ?? DEMO_ROOM_SCANS[0];
}

export function getDefaultScanId() {
  return DEMO_ROOM_SCANS.find((s) => s.selected)?.id ?? DEMO_ROOM_SCANS[0].id;
}

export function getRoomDimensions(scanId: string): RoomDimensions {
  return ROOM_DIMENSIONS[scanId] ?? { width: 16, depth: 14, height: 9 };
}

export function formatFeet(n: number) {
  const feet = Math.floor(n);
  const inches = Math.round((n - feet) * 12);
  return inches > 0 ? `${feet}' ${inches}"` : `${feet}' 0"`;
}

export function loadAllScenes(): Record<string, RoomScene> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(ROOM_SCENES_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, RoomScene>) : {};
  } catch {
    return {};
  }
}

export function loadScene(scanId: string): RoomScene {
  const saved = loadAllScenes()[scanId];
  if (saved) return saved;
  return { scanId, placedItems: DEFAULT_SCENES[scanId] ?? [] };
}

export function saveScene(scene: RoomScene): void {
  if (typeof window === 'undefined') return;
  const all = loadAllScenes();
  all[scene.scanId] = { ...scene, savedAt: new Date().toISOString() };
  localStorage.setItem(ROOM_SCENES_STORAGE_KEY, JSON.stringify(all));
}

export function createPlacedItem(sku: string): PlacedItem {
  return {
    id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    sku,
    x: 35 + Math.random() * 30,
    y: 40 + Math.random() * 25,
    scale: 0.85,
    rotation: 0,
  };
}

export function sceneTotal(placedItems: PlacedItem[]): number {
  return placedItems.reduce((sum, item) => {
    const product = DEMO_CATALOG.find((p) => p.sku === item.sku);
    return sum + (product?.price ?? 0);
  }, 0);
}
