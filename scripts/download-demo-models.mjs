#!/usr/bin/env node
/**
 * Download CC0/CC-BY sample GLBs into public/demo/models/ for offline room builder.
 * Sources: Khronos glTF-Sample-Assets (see manifest.json).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'public/demo/models');
const manifestPath = path.join(outDir, 'manifest.json');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const sources = manifest.sources ?? {};

fs.mkdirSync(outDir, { recursive: true });

for (const [filename, url] of Object.entries(sources)) {
  const dest = path.join(outDir, filename);
  process.stdout.write(`Downloading ${filename}… `);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`${(buf.length / 1024 / 1024).toFixed(1)} MB`);
}

console.log('Done. Models saved to public/demo/models/');
