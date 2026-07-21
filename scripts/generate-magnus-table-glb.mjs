#!/usr/bin/env node
/**
 * Generate Magnus 31" Round pedestal dining table GLB
 * (sintered stone top + fluted wood base + decor vignette).
 * Hero SKU: HEFTDT-8404
 *
 * Run: npm run generate-magnus-table
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
      const ab = this._buf.buffer.slice(
        this._buf.byteOffset,
        this._buf.byteOffset + this._buf.byteLength,
      );
      return Promise.resolve(ab);
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
      else if (blob?.buffer) done(blob.buffer);
    }
    readAsDataURL(blob) {
      const done = (ab) => {
        const buf = Buffer.from(ab);
        this.result = `data:application/octet-stream;base64,${buf.toString('base64')}`;
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
const outPath = path.join(__dirname, '../public/demo/models/magnus-table.glb');

// Magnus 31" Round × 30" H (catalog dimensions in meters)
const TABLE_RADIUS = 0.394; // Ø31"
const TABLE_HEIGHT = 0.762; // 30" H
const TOP_THICK = 0.034;

function flutedPedestal(radius, height, grooves = 32, depth = 0.016) {
  const radial = grooves * 2;
  const geo = new THREE.CylinderGeometry(radius, radius * 1.1, height, radial, 1, false);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const angle = Math.atan2(v.z, v.x);
    const flute = Math.cos(angle * grooves) * depth;
    const n = new THREE.Vector3(v.x, 0, v.z).normalize();
    v.addScaledVector(n, flute);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

function stoneTop() {
  const geo = new THREE.CylinderGeometry(TABLE_RADIUS, TABLE_RADIUS, TOP_THICK, 80);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xf3f0ea,
    roughness: 0.14,
    metalness: 0.1,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = TABLE_HEIGHT - TOP_THICK / 2;
  return mesh;
}

function woodPedestal() {
  const pedestalH = TABLE_HEIGHT - TOP_THICK - 0.015;
  const geo = flutedPedestal(0.17, pedestalH, 36, 0.018);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x4a3420,
    roughness: 0.7,
    metalness: 0.05,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = pedestalH / 2;
  return mesh;
}

function decorVase() {
  const group = new THREE.Group();
  const topY = TABLE_HEIGHT + 0.01;
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 20, 16),
    new THREE.MeshStandardMaterial({ color: 0xf6f4f0, roughness: 0.88 }),
  );
  body.scale.set(1.1, 1.35, 1.1);
  body.position.y = topY + 0.04;
  group.add(body);

  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.034, 0.05, 16),
    new THREE.MeshStandardMaterial({ color: 0xf6f4f0, roughness: 0.88 }),
  );
  neck.position.y = topY + 0.1;
  group.add(neck);
  return group;
}

function branchWithLeaves() {
  const group = new THREE.Group();
  const topY = TABLE_HEIGHT + 0.12;
  const stick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.004, 0.005, 0.18, 8),
    new THREE.MeshStandardMaterial({ color: 0x5c3d20, roughness: 0.9 }),
  );
  stick.position.set(0.015, topY, 0);
  stick.rotation.z = 0.35;
  stick.rotation.x = -0.2;
  group.add(stick);

  const leafMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.65,
    emissive: 0x92400e,
    emissiveIntensity: 0.15,
  });
  for (const [x, y, z] of [
    [0.04, topY + 0.05, 0.02],
    [0.03, topY + 0.03, -0.03],
    [-0.015, topY + 0.07, 0.015],
    [0.05, topY - 0.02, -0.015],
  ]) {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), leafMat);
    leaf.scale.set(1.4, 0.8, 0.6);
    leaf.position.set(x, y, z);
    group.add(leaf);
  }
  return group;
}

function buildScene() {
  const root = new THREE.Group();
  root.name = 'Magnus31RoundTable';

  root.add(stoneTop());
  root.add(woodPedestal());
  root.add(decorVase());
  root.add(branchWithLeaves());

  const box = new THREE.Box3().setFromObject(root);
  root.position.y = -box.min.y;
  return root;
}

const scene = buildScene();
const exporter = new GLTFExporter();

const buffer = await new Promise((resolve, reject) => {
  exporter.parse(
    scene,
    (result) => {
      if (result instanceof ArrayBuffer) resolve(Buffer.from(result));
      else reject(new Error('Expected binary GLB'));
    },
    (err) => reject(err),
    { binary: true },
  );
});

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, Buffer.from(buffer));
const kb = (buffer.byteLength / 1024).toFixed(1);
console.log(`✓ Wrote ${outPath} (${kb} KB) — Magnus 31" Round`);
