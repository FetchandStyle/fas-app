#!/usr/bin/env node
/**
 * Generate Lund 3-Seater Convertible Sofa Bed GLB
 * Light wood frame, cream upholstery, lift-up seat storage. SKU: HEFTSB-3202
 *
 * Run: npm run generate-lund-sofa
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
const outPath = path.join(__dirname, '../public/demo/models/lund-sofa.glb');

// Catalog: 78" W × 33" D × 31" H
const WIDTH = 1.981;
const DEPTH = 0.838;
const HEIGHT = 0.787;
const ARM_W = 0.11;
const SEAT_THICK = 0.16;
const LIFT_ANGLE = 0.48;

const wood = new THREE.MeshStandardMaterial({ color: 0xc9a66b, roughness: 0.68, metalness: 0.02 });
const woodDark = new THREE.MeshStandardMaterial({ color: 0xa8844f, roughness: 0.72 });
const fabric = new THREE.MeshStandardMaterial({ color: 0xeae6dc, roughness: 0.92 });
const fabricShadow = new THREE.MeshStandardMaterial({ color: 0xddd8cc, roughness: 0.94 });
const metal = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.45, metalness: 0.55 });
const yellow = new THREE.MeshStandardMaterial({ color: 0xf5c518, roughness: 0.85 });

function box(w, h, d, mat, x, y, z) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  return m;
}

function woodArm(side) {
  const group = new THREE.Group();
  const x = side * (WIDTH / 2 - ARM_W / 2);
  const armH = HEIGHT * 0.55;
  group.add(box(ARM_W, armH, DEPTH, wood, x, armH / 2 + 0.14, 0));
  group.add(box(ARM_W, 0.06, DEPTH, wood, x, 0.14 + armH, 0));
  group.add(box(ARM_W, armH, 0.06, wood, x, armH / 2 + 0.14, DEPTH / 2 - 0.03));
  group.add(box(ARM_W, armH, 0.06, wood, x, armH / 2 + 0.14, -DEPTH / 2 + 0.03));
  return group;
}

function woodFrame() {
  const group = new THREE.Group();
  group.add(woodArm(-1));
  group.add(woodArm(1));
  group.add(box(WIDTH - ARM_W * 2, 0.14, 0.08, woodDark, 0, 0.07, DEPTH / 2 - 0.04));
  group.add(box(WIDTH - ARM_W * 2, 0.1, 0.06, wood, 0, 0.36, -DEPTH / 2 + 0.03));
  return group;
}

function liftMechanism() {
  const group = new THREE.Group();
  const innerW = WIDTH - ARM_W * 2 - 0.08;
  for (let i = 0; i < 7; i++) {
    const z = -DEPTH / 2 + 0.12 + i * 0.09;
    group.add(box(innerW, 0.02, 0.04, metal, 0, 0.32, z));
  }
  group.add(box(0.04, 0.18, 0.04, metal, -innerW / 2 + 0.06, 0.28, -DEPTH / 2 + 0.2));
  group.add(box(0.04, 0.18, 0.04, metal, innerW / 2 - 0.06, 0.28, -DEPTH / 2 + 0.2));
  return group;
}

function hingedSeat() {
  const group = new THREE.Group();
  const innerW = WIDTH - ARM_W * 2 - 0.06;
  const hingeZ = -DEPTH / 2 + 0.18;
  group.position.set(0, 0.38, hingeZ);
  group.rotation.x = -LIFT_ANGLE;

  const seat = box(innerW, SEAT_THICK, DEPTH - 0.28, fabric, 0, SEAT_THICK / 2, (DEPTH - 0.28) / 2 - 0.08);
  group.add(seat);

  const pillow1 = box(0.28, 0.1, 0.28, yellow, -0.35, SEAT_THICK + 0.05, 0.35);
  const pillow2 = box(0.28, 0.1, 0.28, yellow, 0.35, SEAT_THICK + 0.05, 0.35);
  group.add(pillow1);
  group.add(pillow2);

  return group;
}

function backCushions() {
  const group = new THREE.Group();
  const cushionW = (WIDTH - ARM_W * 2 - 0.14) / 2;
  const backH = 0.38;
  const backY = 0.52;
  const backZ = -DEPTH / 2 + 0.22;

  for (const xOff of [-cushionW / 2 - 0.02, cushionW / 2 + 0.02]) {
    const c = box(cushionW, backH, 0.14, fabricShadow, xOff, backY, backZ);
    group.add(c);
    const button = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 12, 8),
      new THREE.MeshStandardMaterial({ color: 0xd5d0c4, roughness: 0.9 }),
    );
    button.position.set(xOff, backY, backZ + 0.08);
    group.add(button);
  }
  return group;
}

function buildScene() {
  const root = new THREE.Group();
  root.name = 'Lund3SeaterSofaBed';

  root.add(woodFrame());
  root.add(liftMechanism());
  root.add(hingedSeat());
  root.add(backCushions());

  const box3 = new THREE.Box3().setFromObject(root);
  root.position.y = -box3.min.y;
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
console.log(`✓ Wrote ${outPath} (${(buffer.byteLength / 1024).toFixed(1)} KB) — Lund 3-Seater`);
