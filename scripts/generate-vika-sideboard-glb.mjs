#!/usr/bin/env node
/**
 * Generate Vika Modern Sideboard GLB — fluted wave front, dark walnut, tapered legs.
 * SKU: HEFTSD-8840
 *
 * Run: npm run generate-vika-sideboard
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
const outPath = path.join(__dirname, '../public/demo/models/vika-sideboard.glb');

// Catalog: 55" W × 16" D × 30" H
const WIDTH = 1.397;
const DEPTH = 0.406;
const HEIGHT = 0.762;
const LEG_H = 0.1;
const BODY_H = HEIGHT - LEG_H;
const T = 0.022;

const walnut = new THREE.MeshStandardMaterial({ color: 0x5c3d2e, roughness: 0.58, metalness: 0.04 });
const walnutLight = new THREE.MeshStandardMaterial({ color: 0x7a5238, roughness: 0.55 });
const walnutDark = new THREE.MeshStandardMaterial({ color: 0x3d281c, roughness: 0.65 });
const legMat = new THREE.MeshStandardMaterial({ color: 0x1a1410, roughness: 0.5, metalness: 0.2 });
const decorVase = new THREE.MeshStandardMaterial({ color: 0x2a2018, roughness: 0.35 });
const decorYellow = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.7 });
const decorWhite = new THREE.MeshStandardMaterial({ color: 0xf5f3ef, roughness: 0.5 });

function box(w, h, d, mat, x, y, z) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  return m;
}

function waveFrontPanel() {
  const segsX = 64;
  const segsY = 28;
  const geo = new THREE.PlaneGeometry(WIDTH - T * 2, BODY_H - T * 2, segsX, segsY);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const nx = (v.x / WIDTH) * Math.PI * 2;
    const ny = (v.y / BODY_H) * Math.PI * 4;
    const band = Math.floor((v.y / BODY_H + 0.5) * 4);
    const bandWave = Math.sin(nx * 3 + band * 1.2) * 0.028;
    const ripple = Math.sin(nx * 7 + ny * 0.5) * 0.008;
    const ridge = Math.max(0, Math.sin(nx * 2.5 + band * 0.8)) * 0.022;
    pos.setZ(i, bandWave + ripple + ridge + 0.035);
  }
  geo.computeVertexNormals();

  const mesh = new THREE.Mesh(geo, walnutLight);
  mesh.position.set(0, LEG_H + BODY_H / 2, DEPTH / 2 - 0.01);
  return mesh;
}

function cabinetBody() {
  const group = new THREE.Group();
  const cy = LEG_H + BODY_H / 2;

  group.add(box(WIDTH, BODY_H, T, walnut, 0, cy, -DEPTH / 2 + T / 2));
  group.add(box(T, BODY_H, DEPTH, walnut, -WIDTH / 2 + T / 2, cy, 0));
  group.add(box(T, BODY_H, DEPTH, walnut, WIDTH / 2 - T / 2, cy, 0));
  group.add(box(WIDTH - T * 2, T, DEPTH - T, walnutDark, 0, LEG_H + T / 2, 0));
  group.add(box(WIDTH - T * 2, T, DEPTH - T, walnutDark, 0, LEG_H + BODY_H - T / 2, 0));
  group.add(waveFrontPanel());

  const top = box(WIDTH, T, DEPTH, walnut, 0, LEG_H + BODY_H + T / 2, 0);
  group.add(top);
  return group;
}

function taperedLegs() {
  const group = new THREE.Group();
  const positions = [
    [-WIDTH / 2 + 0.08, -DEPTH / 2 + 0.07],
    [WIDTH / 2 - 0.08, -DEPTH / 2 + 0.07],
    [-WIDTH / 2 + 0.08, DEPTH / 2 - 0.07],
    [WIDTH / 2 - 0.08, DEPTH / 2 - 0.07],
  ];
  for (const [x, z] of positions) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.028, LEG_H, 8), legMat);
    leg.position.set(x, LEG_H / 2, z);
    group.add(leg);
  }
  return group;
}

function topDecor() {
  const group = new THREE.Group();
  const topY = LEG_H + BODY_H + 0.04;

  const vase = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), decorVase);
  vase.scale.set(1, 1.15, 1);
  vase.position.set(-0.35, topY + 0.06, 0);
  group.add(vase);

  const branch = new THREE.Mesh(
    new THREE.CylinderGeometry(0.004, 0.005, 0.22, 6),
    new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.9 }),
  );
  branch.position.set(-0.33, topY + 0.2, 0);
  branch.rotation.z = 0.2;
  group.add(branch);

  for (const [x, y, z] of [
    [-0.28, 0.28, 0.03],
    [-0.38, 0.26, -0.02],
    [-0.32, 0.3, 0.01],
  ]) {
    const flower = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 6), decorYellow);
    flower.position.set(-0.35 + x * 0.1, topY + y, z);
    group.add(flower);
  }

  group.add(box(0.14, 0.025, 0.1, walnutDark, 0.05, topY + 0.02, 0));

  for (const x of [0.28, 0.42]) {
    const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.08, 12), decorWhite);
    candle.position.set(x, topY + 0.04, 0.05);
    group.add(candle);
    const holder = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.015, 12), decorWhite);
    holder.position.set(x, topY + 0.01, 0.05);
    group.add(holder);
  }

  return group;
}

function buildScene() {
  const root = new THREE.Group();
  root.name = 'VikaModernSideboard';
  root.add(cabinetBody());
  root.add(taperedLegs());
  root.add(topDecor());
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
console.log(`✓ Wrote ${outPath} (${(buffer.byteLength / 1024).toFixed(1)} KB) — Vika Sideboard`);
