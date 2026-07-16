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
  /** Height above floor in scene units (~meters). 0 = on floor. */
  lift: number;
}

export const LIFT_STEP = 0.12;
export const LIFT_MAX = 2.4;

export function clampLift(value: number): number {
  return Math.min(LIFT_MAX, Math.max(0, value));
}

export function formatLiftHeight(lift: number): string {
  if (lift < 0.05) return 'Floor';
  const inches = Math.round(lift * 39.37);
  return `${inches}"`;
}

function withDefaults(item: PlacedItem): PlacedItem {
  return { ...item, lift: item.lift ?? 0 };
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
    { id: 'd1', sku: 'HEFTSF-7730', x: 32, y: 52, scale: 0.95, rotation: 0, lift: 0 },
    { id: 'd2', sku: 'HEFTCT-4410', x: 58, y: 58, scale: 0.85, rotation: 0, lift: 0 },
    { id: 'd3', sku: 'HEFTST-2201', x: 74, y: 48, scale: 0.8, rotation: 12, lift: 0 },
    { id: 'd4', sku: 'HEFTBS-6620', x: 82, y: 30, scale: 0.9, rotation: -90, lift: 0 },
    { id: 'd5', sku: 'HEFTSD-8840', x: 20, y: 32, scale: 0.85, rotation: 90, lift: 0 },
    { id: 'd6', sku: 'HEFTDC-5510', x: 55, y: 74, scale: 0.75, rotation: -20, lift: 0 },
  ],
  'scan-1': [
    { id: 'd1', sku: 'HEFTSB-3202', x: 38, y: 50, scale: 0.95, rotation: 0, lift: 0 },
    { id: 'd2', sku: 'HEFTCT-4410', x: 62, y: 58, scale: 0.8, rotation: 0, lift: 0 },
    { id: 'd3', sku: 'HEFTST-2201', x: 76, y: 44, scale: 0.75, rotation: 0, lift: 0 },
  ],
  'scan-2': [
    { id: 'd1', sku: 'HEFTSF-7730', x: 30, y: 48, scale: 0.9, rotation: 0, lift: 0 },
    { id: 'd2', sku: 'HEFTDT-8404', x: 58, y: 62, scale: 0.85, rotation: 0, lift: 0 },
    { id: 'd3', sku: 'HEFTDC-5510', x: 72, y: 38, scale: 0.7, rotation: 25, lift: 0 },
    { id: 'd4', sku: 'HEFTBS-6620', x: 84, y: 28, scale: 0.85, rotation: -90, lift: 0 },
  ],
};

export function resetScene(scanId: string): RoomScene {
  const placedItems = DEFAULT_SCENES[scanId]?.map((item) => ({ ...item })) ?? [];
  const scene: RoomScene = { scanId, placedItems };
  saveScene(scene);
  return scene;
}

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
  if (saved) {
    return {
      ...saved,
      placedItems: saved.placedItems.map(withDefaults),
    };
  }
  return { scanId, placedItems: (DEFAULT_SCENES[scanId] ?? []).map(withDefaults) };
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
    x: 30 + Math.random() * 40,
    y: 35 + Math.random() * 30,
    scale: 0.75,
    rotation: 0,
    lift: 0,
  };
}

export function sceneTotal(placedItems: PlacedItem[]): number {
  return placedItems.reduce((sum, item) => {
    const product = DEMO_CATALOG.find((p) => p.sku === item.sku);
    return sum + (product?.price ?? 0);
  }, 0);
}
