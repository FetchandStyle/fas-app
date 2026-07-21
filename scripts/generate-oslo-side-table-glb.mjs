#!/usr/bin/env node
/**
 * Generate Oslo Round Side Table GLB — fluted drum cylinder with storage door detail.
 * SKU: HEFTST-2201 (18" Ø × 22" H)
 *
 * Run: npm run generate-oslo-side-table
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
      this.type = 'application/octet-stream';
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
const outPath = path.join(__dirname, '../public/demo/models/oslo-side-table.glb');

// Catalog: 18" Ø × 22" H
const RADIUS = 0.2286;
const HEIGHT = 0.5588;
const SLATS = 52;

const woodMat = new THREE.MeshStandardMaterial({
  color: 0x8b6914,
  roughness: 0.62,
  metalness: 0.04,
});
const woodDarkMat = new THREE.MeshStandardMaterial({
  color: 0x6b4f1a,
  roughness: 0.7,
});
const hingeMat = new THREE.MeshStandardMaterial({
  color: 0x2a2a2a,
  roughness: 0.4,
  metalness: 0.6,
});

function flutedDrumBody() {
  const group = new THREE.Group();

  // Inner core (visible between slats)
  const core = new THREE.Mesh(
    new THREE.CylinderGeometry(RADIUS * 0.88, RADIUS * 0.88, HEIGHT * 0.94, 32),
    woodDarkMat,
  );
  core.position.y = HEIGHT / 2;
  group.add(core);

  // Vertical slats around circumference
  const slatH = HEIGHT * 0.94;
  const slatW = (2 * Math.PI * RADIUS) / SLATS * 0.72;
  for (let i = 0; i < SLATS; i++) {
    const angle = (i / SLATS) * Math.PI * 2;
    const slat = new THREE.Mesh(new THREE.BoxGeometry(slatW, slatH, 0.022), woodMat);
    const r = RADIUS - 0.008;
    slat.position.set(Math.cos(angle) * r, slatH / 2, Math.sin(angle) * r);
    slat.rotation.y = -angle;
    group.add(slat);
  }

  return group;
}

function topWithLip() {
  const group = new THREE.Group();
  const topY = HEIGHT + 0.004;

  const lip = new THREE.Mesh(
    new THREE.CylinderGeometry(RADIUS + 0.006, RADIUS + 0.004, 0.018, 64),
    woodMat,
  );
  lip.position.y = topY;
  group.add(lip);

  const surface = new THREE.Mesh(
    new THREE.CylinderGeometry(RADIUS - 0.01, RADIUS - 0.01, 0.012, 64),
    woodMat,
  );
  surface.position.y = topY + 0.008;
  group.add(surface);

  return group;
}

function storageDoorHinges() {
  const group = new THREE.Group();
  const doorAngle = Math.PI * 0.55;
  const hingeR = RADIUS - 0.005;
  for (const [yOff, size] of [
    [HEIGHT * 0.35, 0.028],
    [HEIGHT * 0.65, 0.028],
  ]) {
    const hinge = new THREE.Mesh(new THREE.BoxGeometry(0.008, size, 0.014), hingeMat);
    hinge.position.set(Math.cos(doorAngle) * hingeR, yOff, Math.sin(doorAngle) * hingeR);
    hinge.rotation.y = -doorAngle;
    group.add(hinge);
  }
  return group;
}

function tableLamp() {
  const group = new THREE.Group();
  const baseY = HEIGHT + 0.02;

  const marble = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.04, 0.1),
    new THREE.MeshStandardMaterial({ color: 0xe8e4dc, roughness: 0.25, metalness: 0.05 }),
  );
  marble.position.y = baseY + 0.02;
  group.add(marble);

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.008, 0.01, 0.12, 12),
    new THREE.MeshStandardMaterial({ color: 0xc9b896, roughness: 0.5 }),
  );
  stem.position.y = baseY + 0.1;
  group.add(stem);

  const shade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.11, 0.14, 24, 1, true),
    new THREE.MeshStandardMaterial({
      color: 0xf8f6f2,
      roughness: 0.92,
      side: THREE.DoubleSide,
    }),
  );
  shade.position.y = baseY + 0.22;
  group.add(shade);

  return group;
}

function buildScene() {
  const root = new THREE.Group();
  root.name = 'OsloRoundSideTable';

  root.add(flutedDrumBody());
  root.add(topWithLip());
  root.add(storageDoorHinges());
  root.add(tableLamp());

  const box = new THREE.Box3().setFromObject(root);
  root.position.y = -box.min.y;
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
console.log(`✓ Wrote ${outPath} (${(buffer.byteLength / 1024).toFixed(1)} KB) — Oslo Round Side`);
