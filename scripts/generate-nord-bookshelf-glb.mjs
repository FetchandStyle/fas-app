#!/usr/bin/env node
/**
 * Generate Nord 3-Tier Bookshelf GLB
 * Open top shelf, 4 cubbies, 4 drawers, tapered legs. SKU: HEFTBS-6620
 *
 * Run: npm run generate-nord-bookshelf
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
const outPath = path.join(__dirname, '../public/demo/models/nord-bookshelf.glb');

// Catalog: 31" W × 12" D × 42" H
const WIDTH = 0.787;
const DEPTH = 0.305;
const HEIGHT = 1.067;
const LEG_H = 0.14;
const BODY_H = HEIGHT - LEG_H;
const T = 0.022;

const wood = new THREE.MeshStandardMaterial({ color: 0xc4a574, roughness: 0.62, metalness: 0.02 });
const woodDark = new THREE.MeshStandardMaterial({ color: 0xa8844f, roughness: 0.68 });
const drawerFront = new THREE.MeshStandardMaterial({ color: 0xe8e0d0, roughness: 0.88 });
const decorWhite = new THREE.MeshStandardMaterial({ color: 0xf5f3ef, roughness: 0.4 });
const decorBook = new THREE.MeshStandardMaterial({ color: 0x6b5b4f, roughness: 0.8 });

function box(w, h, d, mat, x, y, z) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  return m;
}

function cabinetBody() {
  const group = new THREE.Group();
  const baseY = LEG_H;

  group.add(box(WIDTH, BODY_H, T, wood, 0, baseY + BODY_H / 2, -DEPTH / 2 + T / 2));
  group.add(box(WIDTH, BODY_H, T, wood, 0, baseY + BODY_H / 2, DEPTH / 2 - T / 2));
  group.add(box(T, BODY_H, DEPTH, wood, -WIDTH / 2 + T / 2, baseY + BODY_H / 2, 0));
  group.add(box(T, BODY_H, DEPTH, wood, WIDTH / 2 - T / 2, baseY + BODY_H / 2, 0));

  const tierH = BODY_H / 3;
  const drawerTop = baseY + tierH;
  const midTop = baseY + tierH * 2;

  group.add(box(WIDTH - T * 2, T, DEPTH - T * 2, woodDark, 0, drawerTop, 0));
  group.add(box(WIDTH - T * 2, T, DEPTH - T * 2, woodDark, 0, midTop, 0));
  group.add(box(WIDTH - T * 2, T, DEPTH - T * 2, woodDark, 0, baseY + BODY_H - T / 2, 0));

  for (let i = 1; i < 4; i++) {
    const x = -WIDTH / 2 + (WIDTH / 4) * i;
    group.add(box(T, tierH - T, DEPTH - T * 2, wood, x, midTop + tierH / 2, 0));
  }

  const drawerW = (WIDTH - T * 2 - T) / 2;
  const drawerH = (tierH - T * 2) / 2;
  for (const [row, col] of [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ]) {
    const x = (col - 0.5) * (drawerW + T);
    const y = baseY + drawerH / 2 + T + row * (drawerH + T);
    const front = box(drawerW - 0.01, drawerH - 0.01, 0.018, drawerFront, x, y, DEPTH / 2 - 0.02);
    group.add(front);
    const knob = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.028, 0.012), wood);
    knob.position.set(x, y, DEPTH / 2 + 0.002);
    group.add(knob);
  }

  return group;
}

function taperedLegs() {
  const group = new THREE.Group();
  const positions = [
    [-WIDTH / 2 + 0.05, -DEPTH / 2 + 0.05],
    [WIDTH / 2 - 0.05, -DEPTH / 2 + 0.05],
    [-WIDTH / 2 + 0.05, DEPTH / 2 - 0.05],
    [WIDTH / 2 - 0.05, DEPTH / 2 - 0.05],
  ];
  for (const [x, z] of positions) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.026, LEG_H, 8), wood);
    leg.position.set(x, LEG_H / 2, z);
    group.add(leg);
  }
  group.add(box(WIDTH - 0.12, 0.025, 0.025, woodDark, 0, LEG_H * 0.55, DEPTH / 2 - 0.04));
  group.add(box(WIDTH - 0.12, 0.025, 0.025, woodDark, 0, LEG_H * 0.55, -DEPTH / 2 + 0.04));
  return group;
}

function shelfDecor() {
  const group = new THREE.Group();
  const topY = LEG_H + BODY_H - 0.08;

  const bowl = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    decorWhite,
  );
  bowl.position.set(-0.12, topY, 0);
  group.add(bowl);

  for (let i = 0; i < 3; i++) {
    group.add(box(0.1, 0.018, 0.07, decorBook, 0.15, topY + i * 0.02, 0));
  }

  const midY = LEG_H + BODY_H / 3 + BODY_H / 6;
  const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.1, 16), decorWhite);
  vase.position.set(-0.22, midY + 0.05, 0);
  group.add(vase);

  group.add(box(0.04, 0.12, 0.05, decorBook, -0.05, midY + 0.06, 0));

  const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.14, 12), woodDark);
  bottle.position.set(0.22, midY + 0.07, 0);
  group.add(bottle);

  return group;
}

function buildScene() {
  const root = new THREE.Group();
  root.name = 'Nord3TierBookshelf';
  root.add(cabinetBody());
  root.add(taperedLegs());
  root.add(shelfDecor());
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
console.log(`✓ Wrote ${outPath} (${(buffer.byteLength / 1024).toFixed(1)} KB) — Nord Bookshelf`);
