#!/usr/bin/env node
/**
 * Download KayKit CC0 furniture (GitHub) + Khronos fallbacks, convert to GLB
 * for the Las Vegas trade-show room builder demo.
 *
 * Run: npm run setup-show-models
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'public/demo/models');
const tmpDir = path.join(outDir, '_kaykit_src');
const KAYKIT_BASE =
  'https://raw.githubusercontent.com/KayKit-Game-Assets/KayKit-Furniture-Bits-1.0/main/addons/kaykit_furniture_bits/Assets/gltf';

/** KayKit glTF source → output GLB name for the demo */
const KAYKIT_MAP = {
  couch_pillows: 'sofa.glb',
  chair_A: 'chair.glb',
  table_low: 'table.glb',
  shelf_B_large_decorated: 'bookcase.glb',
  table_medium_long: 'desk.glb',
  cabinet_medium_decorated: 'closet.glb',
  rug_rectangle_A: 'rug.glb',
};

const KHRONOS = {
  'sofa.glb':
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenWoodLeatherSofa/glTF-Binary/SheenWoodLeatherSofa.glb',
  'chair.glb':
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenChair/glTF-Binary/SheenChair.glb',
  'table.glb':
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SpecularSilkPouf/glTF-Binary/SpecularSilkPouf.glb',
};

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(tmpDir, { recursive: true });

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

function gltfToGlb(gltfPath, glbPath) {
  const r = spawnSync(
    'npx',
    ['--yes', '@gltf-transform/cli', 'copy', gltfPath, glbPath],
    { cwd: root, stdio: 'inherit' },
  );
  if (r.status !== 0) throw new Error(`gltf-transform failed for ${gltfPath}`);
}

console.log('Downloading KayKit shared texture…');
await download(`${KAYKIT_BASE}/furniturebits_texture.png`, path.join(tmpDir, 'furniturebits_texture.png'));

for (const [srcName, outName] of Object.entries(KAYKIT_MAP)) {
  console.log(`\n→ ${outName} (KayKit ${srcName})`);
  const gltfDest = path.join(tmpDir, `${srcName}.gltf`);
  const binDest = path.join(tmpDir, `${srcName}.bin`);
  await download(`${KAYKIT_BASE}/${srcName}.gltf`, gltfDest);
  await download(`${KAYKIT_BASE}/${srcName}.bin`, binDest);
  gltfToGlb(gltfDest, path.join(outDir, outName));
  const kb = (fs.statSync(path.join(outDir, outName)).size / 1024).toFixed(0);
  console.log(`  ✓ ${outName} (${kb} KB)`);
}

console.log('\nKhronos fallbacks (optional backup set)…');
const backupDir = path.join(outDir, 'khronos');
fs.mkdirSync(backupDir, { recursive: true });
for (const [name, url] of Object.entries(KHRONOS)) {
  const dest = path.join(backupDir, name);
  if (!fs.existsSync(dest)) {
    process.stdout.write(`  ${name}… `);
    await download(url, dest);
    console.log('ok');
  }
}

// Generate demo-room.glb (simple styled shell as a portable asset)
console.log('\nGenerating demo-room.glb…');
const genScript = path.join(tmpDir, '_gen-room.mjs');
fs.writeFileSync(
  genScript,
  `
import { Document, NodeIO } from '@gltf-transform/core';
import { dedup, prune, flatten } from '@gltf-transform/functions';

const F = 10, H = 3, T = 0.14;
const doc = new Document();
const buffer = doc.createBuffer();

function mat(name, color) {
  const m = doc.createMaterial(name).setBaseColorFactor(color).setRoughnessFactor(0.85);
  return m;
}

function box(name, sx, sy, sz, material, px, py, pz) {
  const pos = [];
  const nrm = [];
  const idx = [];
  const faces = [
    [[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1],[0,0,1]],
    [[1,-1,-1],[-1,-1,-1],[-1,1,-1],[1,1,-1],[0,0,-1]],
    [[-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1],[0,1,0]],
    [[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1],[0,-1,0]],
    [[1,-1,1],[1,-1,-1],[1,1,-1],[1,1,1],[1,0,0]],
    [[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1],[-1,0,0]],
  ];
  const hx = sx/2, hy = sy/2, hz = sz/2;
  let base = 0;
  for (const f of faces) {
    for (const [x,y,z] of f.slice(0,4)) {
      pos.push(px+x*hx, py+y*hy, pz+z*hz);
      const n = f[4]; nrm.push(n[0], n[1], n[2]);
    }
    idx.push(base, base+1, base+2, base, base+2, base+3);
    base += 4;
  }
  const prim = doc.createPrimitive()
    .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(new Float32Array(pos)).setBuffer(buffer))
    .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(new Float32Array(nrm)).setBuffer(buffer))
    .setIndices(doc.createAccessor().setArray(new Uint16Array(idx)).setBuffer(buffer))
    .setMaterial(material);
  return doc.createMesh(name).addPrimitive(prim);
}

const floorM = mat('floor', [0.79, 0.65, 0.42, 1]);
const wallM = mat('wall', [0.95, 0.94, 0.9, 1]);
const trimM = mat('trim', [0.55, 0.45, 0.33, 1]);
const glassM = mat('glass', [0.72, 0.85, 0.94, 0.5]);

const scene = doc.createScene('DemoRoom');
const root = doc.createNode('Room');

root.addChild(doc.createNode('Floor').setMesh(box('FloorMesh', F, 0.08, F, floorM, 0, 0, 0)));
root.addChild(doc.createNode('BackWall').setMesh(box('BackWallMesh', F, H, T, wallM, 0, H/2, -F/2)));
root.addChild(doc.createNode('LeftWall').setMesh(box('LeftWallMesh', F, H, T, wallM, -F/2, H/2, 0)));
root.addChild(doc.createNode('RightWall').setMesh(box('RightWallMesh', F, H, T, wallM, F/2, H/2, 0)));
root.addChild(doc.createNode('WindowFrame').setMesh(box('WindowMesh', 2.4, 1.3, 0.08, trimM, F/2, 1.6, 0.5)));
root.addChild(doc.createNode('WindowGlass').setMesh(box('GlassMesh', 2.0, 0.9, 0.02, glassM, F/2, 1.6, 0.55)));

scene.addChild(root);
await doc.transform(dedup(), prune(), flatten());
const io = new NodeIO();
await io.write('${path.join(outDir, 'demo-room.glb').replace(/\\/g, '/')}', doc);
console.log('  ✓ demo-room.glb');
`,
);

const gen = spawnSync('node', [genScript], { cwd: root, stdio: 'inherit', env: process.env });
if (gen.status !== 0) {
  console.warn('  (demo-room.glb generation skipped — install @gltf-transform/core if needed)');
}

// Cleanup temp
fs.rmSync(tmpDir, { recursive: true, force: true });

console.log('\nDone. Show models in public/demo/models/');
console.log('  sofa.glb, chair.glb, table.glb, bookcase.glb, desk.glb, closet.glb, demo-room.glb');
