#!/usr/bin/env node
/**
 * Downloads demo product images into public/demo/products/<sku>.jpg so the
 * trade-show demo works fully offline (no CDN / Wi-Fi at the booth).
 *
 * Usage:  node scripts/download-demo-images.mjs
 *
 * Reads public/demo/products/manifest.json (SKU -> source URL). Skips entries
 * with an empty URL. Re-run any time you update the manifest.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, '..', 'public', 'demo', 'products');

const manifest = JSON.parse(await readFile(join(dir, 'manifest.json'), 'utf8'));
await mkdir(dir, { recursive: true });

let ok = 0;
let skipped = 0;
for (const [sku, url] of Object.entries(manifest)) {
  if (sku.startsWith('_') || !url) {
    skipped++;
    continue;
  }
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(join(dir, `${sku}.jpg`), buf);
    console.log(`✓ ${sku}  (${(buf.length / 1024).toFixed(0)} KB)`);
    ok++;
  } catch (err) {
    console.error(`✗ ${sku}  ${err.message}`);
  }
}

console.log(`\nDone. Downloaded ${ok}, skipped ${skipped} (empty URL).`);
if (skipped > 1) {
  console.log('Fill in the empty URLs in manifest.json to include those products offline.');
}
