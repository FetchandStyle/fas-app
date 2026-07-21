#!/usr/bin/env node
/**
 * Generate Ari Upholstered Dining Chair GLB
 * Wood frame, bouclé seat, cylindrical back bolster. SKU: HEFTDC-5510
 *
 * Run: npm run generate-ari-chair
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

if (typeof globalThis.Blob === 'undefined') {
  globalThis.Blob = class Blob {
    constructor(parts = []) {
      this._buf = Buffer.concat(
        parts.map((p) => {
          if (Buffer.isBuffer(p)) return p;
          if (p instanceof ArrayBuffer) return Buffer.from(p);
          if (ArrayBuffer.isView(p)) return Buffer.from(p.buffer, p.byteOffset, p.byteLength);
          return Buffer.from(p);
        }),
      );
      this.size = this._buf.length;
    }
    arrayBuffer() {
      return Promise.resolve(
        this._buf.buffer.slice(this._buf.byteOffset, this._buf.byteOffset + this._buf.byteLength),
      );
    }
  };
}
if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    result = null;
    onloadend = null;
    readAsArrayBuffer(blob) {
      const done = (ab) => {
        this.result = ab;
        this.onloadend?.({ target: this });
      };
      if (blob?.arrayBuffer) blob.arrayBuffer().then(done);
      else if (blob instanceof ArrayBuffer) done(blob);
    }
    readAsDataURL(blob) {
      const done = (ab) => {
        this.result = `data:application/octet-stream;base64,${Buffer.from(ab).toString('base64')}`;
        this.onloadend?.({ target: this });
      };
      if (blob?.arrayBuffer) blob.arrayBuffer().then(done);
      else if (blob instanceof ArrayBuffer) done(blob);
    }
  };
}

import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '../public/demo/models/ari-chair.glb');

// Catalog: 22" W × 20" D × 32" H
const WIDTH = 0.559;
const DEPTH = 0.508;
const HEIGHT = 0.813;

const wood = new THREE.MeshStandardMaterial({ color: 0x8b5e34, roughness: 0.55, metalness: 0.04 });
const woodDark = new THREE.MeshStandardMaterial({ color: 0x6d4a2a, roughness: 0.62 });
const fabric = new THREE.MeshStandardMaterial({ color: 0xf2f0ea, roughness: 0.95 });

function box(w, h, d, mat, x, y, z) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  return m;
}

function woodFrame() {
  const group = new THREE.Group();
  const legH = 0.42;
  const seatY = 0.44;

  const legPos = [
    [-WIDTH / 2 + 0.07, DEPTH / 2 - 0.08],
    [WIDTH / 2 - 0.07, DEPTH / 2 - 0.08],
  ];
  for (const [x, z] of legPos) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.03, legH, 10), wood);
    leg.position.set(x, legH / 2, z);
    group.add(leg);
  }

  const plankW = 0.1;
  const plankT = 0.035;
  const plankH = 0.72;
  for (const x of [-WIDTH / 2 + plankW / 2 + 0.02, WIDTH / 2 - plankW / 2 - 0.02]) {
    group.add(box(plankT, plankH, plankW, wood, x, plankH / 2, -DEPTH / 2 + plankW / 2 + 0.02));
  }

  group.add(box(WIDTH - 0.14, 0.05, 0.05, woodDark, 0, seatY - 0.06, DEPTH / 2 - 0.1));
  group.add(box(WIDTH - 0.14, 0.05, 0.05, woodDark, 0, seatY - 0.06, -DEPTH / 2 + 0.12));
  group.add(box(0.05, 0.05, DEPTH - 0.2, woodDark, -WIDTH / 2 + 0.08, seatY - 0.06, 0));
  group.add(box(0.05, 0.05, DEPTH - 0.2, woodDark, WIDTH / 2 - 0.08, seatY - 0.06, 0));

  const rim = box(WIDTH - 0.1, 0.06, DEPTH - 0.1, wood, 0, seatY - 0.03, 0);
  group.add(rim);
  return group;
}

function seatCushion() {
  const group = new THREE.Group();
  const seatY = 0.46;
  const cushion = box(WIDTH - 0.14, 0.11, DEPTH - 0.16, fabric, 0, seatY, 0);
  cushion.scale.set(1, 1, 1);
  group.add(cushion);

  const soften = box(WIDTH - 0.18, 0.08, DEPTH - 0.2, fabric, 0, seatY + 0.02, 0);
  group.add(soften);
  return group;
}

function cylindricalBackrest() {
  const group = new THREE.Group();
  const bolsterR = 0.1;
  const bolsterLen = WIDTH - 0.2;
  const backZ = -DEPTH / 2 + 0.18;
  const backY = 0.58;

  const bolster = new THREE.Mesh(
    new THREE.CylinderGeometry(bolsterR, bolsterR, bolsterLen, 24),
    fabric,
  );
  bolster.rotation.z = Math.PI / 2;
  bolster.position.set(0, backY, backZ);
  group.add(bolster);

  const slotL = box(0.04, bolsterR * 1.6, 0.06, woodDark, -bolsterLen / 2 + 0.06, backY, backZ);
  const slotR = box(0.04, bolsterR * 1.6, 0.06, woodDark, bolsterLen / 2 - 0.06, backY, backZ);
  group.add(slotL);
  group.add(slotR);

  return group;
}

function buildScene() {
  const root = new THREE.Group();
  root.name = 'AriDiningChair';

  root.add(woodFrame());
  root.add(seatCushion());
  root.add(cylindricalBackrest());

  const bbox = new THREE.Box3().setFromObject(root);
  root.position.y = -bbox.min.y;
  return root;
}

const exporter = new GLTFExporter();
const buffer = await new Promise((resolve, reject) => {
  exporter.parse(
    buildScene(),
    (result) => {
      if (result instanceof ArrayBuffer) resolve(Buffer.from(result));
      else reject(new Error('Expected binary GLB'));
    },
    (err) => reject(err),
    { binary: true },
  );
});

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, buffer);
console.log(`✓ Wrote ${outPath} (${(buffer.byteLength / 1024).toFixed(1)} KB) — Ari Chair`);
