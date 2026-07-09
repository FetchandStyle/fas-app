#!/usr/bin/env node
/**
 * Downloads demo product images into public/demo/products/<sku>.jpg
 * so the trade-show demo works fully offline.
 *
 * Usage:  node scripts/download-demo-images.mjs
 */
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, '..', 'public', 'demo', 'products');

const manifest = JSON.parse(await readFile(join(dir, 'manifest.json'), 'utf8'));
await mkdir(dir, { recursive: true });

let ok = 0;
let failed = 0;
let skipped = 0;

for (const [sku, url] of Object.entries(manifest)) {
  if (sku.startsWith('_') || !url) {
    skipped++;
    continue;
  }

  const dest = join(dir, `${sku}.jpg`);

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'fas-app-demo-downloader/1.0' },
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1024) throw new Error('Response too small — likely not an image');

    await writeFile(dest, buf);
    console.log(`✓ ${sku}  (${(buf.length / 1024).toFixed(0)} KB)`);
    ok++;
  } catch (err) {
    console.error(`✗ ${sku}  ${err.message}`);
    failed++;
  }
}

// Verify all catalog SKUs have a local file
const catalogSkus = [
  'HEFTDT-8404',
  'HEFTST-2201',
  'HEFTSB-3202',
  'HEFTCT-4410',
  'HEFTDC-5510',
  'HEFTBS-6620',
  'HEFTSF-7730',
  'HEFTSD-8840',
];

let missing = 0;
for (const sku of catalogSkus) {
  try {
    await access(join(dir, `${sku}.jpg`));
  } catch {
    console.error(`⚠ Missing local file: ${sku}.jpg`);
    missing++;
  }
}

console.log(`\nDone. Downloaded ${ok}, failed ${failed}, skipped ${skipped}.`);
if (missing > 0) {
  console.log(`${missing} catalog SKU(s) still missing — search cards may show fallback.`);
  process.exit(1);
}
