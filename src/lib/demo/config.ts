/**
 * Demo Mode — trade-show / offline-safe demo.
 *
 * When enabled, the app serves a local Hernest catalog, precomputed AI
 * enrichment, and mock auth so nothing depends on backend, Firebase,
 * Postgres, or Wi-Fi. Toggle with NEXT_PUBLIC_DEMO_MODE=true.
 */
export const IS_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';

/** SKU of the single hero product used across the intelligence demo. */
export const HERO_PRODUCT_SKU = 'HEFTDT-8404';
