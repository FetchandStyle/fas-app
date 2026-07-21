#!/usr/bin/env node
/**
 * Generate Bergen Oval lift-top coffee table GLB
 * Fluted body, side drawers, raised top, tapered legs. SKU: HEFTCT-4410
 *
 * Run: npm run generate-bergen-table
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
const outPath = path.join(__dirname, '../public/demo/models/bergen-table.glb');

// Catalog: 47" L × 24" W × 16" H
const LENGTH = 1.194;
const WIDTH = 0.61;
const BODY_H = 0.28;
const TOP_THICK = 0.035;
const LIFT_GAP = 0.14;
const CORNER_R = 0.28;

const wood = new THREE.MeshStandardMaterial({ color: 0xb8894a, roughness: 0.62, metalness: 0.03 });
const woodLight = new THREE.MeshStandardMaterial({ color: 0xd4a96a, roughness: 0.7 });
const woodInner = new THREE.MeshStandardMaterial({ color: 0xe8dcc8, roughness: 0.8 });
const metal = new THREE.MeshStandardMaterial({ color: 0x1c1c1c, roughness: 0.4, metalness: 0.65 });

function stadiumShape(len, wid, radius) {
  const shape = new THREE.Shape();
  const hl = len / 2 - radius;
  const hw = wid / 2;
  shape.moveTo(-hl, -hw);
  shape.lineTo(hl, -hw);
  shape.absarc(hl, 0, hw, -Math.PI / 2, Math.PI / 2, false);
  shape.lineTo(-hl, hw);
  shape.absarc(-hl, 0, hw, Math.PI / 2, (Math.PI * 3) / 2, false);
  return shape;
}

function extrudedTop(y, thick) {
  const geo = new THREE.ExtrudeGeometry(stadiumShape(LENGTH, WIDTH, CORNER_R), {
    depth: thick,
    bevelEnabled: false,
  });
  geo.rotateX(-Math.PI / 2);
  const mesh = new THREE.Mesh(geo, wood);
  mesh.position.y = y;
  return mesh;
}

function flutedBody() {
  const group = new THREE.Group();
  const slatsLong = 36;
  const slatsShort = 14;
  const slatT = 0.018;

  for (let i = 0; i < slatsLong; i++) {
    const t = i / (slatsLong - 1);
    const x = -LENGTH / 2 + 0.12 + t * (LENGTH - 0.24);
    const slat = new THREE.Mesh(new THREE.BoxGeometry(slatT, BODY_H, WIDTH), wood);
    slat.position.set(x, BODY_H / 2, 0);
    group.add(slat);
  }
  for (let i = 0; i < slatsShort; i++) {
    const t = i / (slatsShort - 1);
    const z = -WIDTH / 2 + 0.04 + t * (WIDTH - 0.08);
    for (const x of [LENGTH / 2 - 0.03, -LENGTH / 2 + 0.03]) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.06, BODY_H, slatT), wood);
      slat.position.set(x, BODY_H / 2, z);
      group.add(slat);
    }
  }

  const inner = new THREE.Mesh(
    new THREE.BoxGeometry(LENGTH - 0.08, BODY_H - 0.04, WIDTH - 0.06),
    woodLight,
  );
  inner.position.y = BODY_H / 2;
  group.add(inner);
  return group;
}

function drawers() {
  const group = new THREE.Group();
  const drawerL = WIDTH - 0.06;
  const drawerH = BODY_H - 0.08;
  const drawerD = 0.22;
  const pull = 0.18;

  for (const side of [-1, 1]) {
    const d = new THREE.Group();
    const front = new THREE.Mesh(new THREE.BoxGeometry(0.04, drawerH, drawerL), wood);
    front.position.set(side * (drawerD / 2 + 0.02), drawerH / 2 + 0.04, 0);
    d.add(front);

    const inner = new THREE.Mesh(new THREE.BoxGeometry(drawerD, drawerH - 0.04, drawerL - 0.06), woodInner);
    inner.position.set(0, drawerH / 2 + 0.04, 0);
    d.add(inner);

    const rail = new THREE.Mesh(new THREE.BoxGeometry(drawerD, 0.02, drawerL - 0.1), metal);
    rail.position.set(0, drawerH / 2 + 0.02, 0);
    d.add(rail);

    d.position.x = side * (LENGTH / 2 + pull);
    group.add(d);
  }
  return group;
}

function liftMechanism(topY) {
  const group = new THREE.Group();
  const posts = [
    [-LENGTH / 4, -WIDTH / 4],
    [LENGTH / 4, -WIDTH / 4],
    [-LENGTH / 4, WIDTH / 4],
    [LENGTH / 4, WIDTH / 4],
  ];
  for (const [x, z] of posts) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.03, LIFT_GAP, 0.03), metal);
    post.position.set(x, BODY_H + LIFT_GAP / 2, z);
    group.add(post);
  }
  const bar1 = new THREE.Mesh(new THREE.BoxGeometry(LENGTH * 0.55, 0.025, 0.025), metal);
  bar1.position.set(0, BODY_H + 0.04, 0);
  group.add(bar1);
  const bar2 = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.025, WIDTH * 0.45), metal);
  bar2.position.set(0, BODY_H + 0.04, 0);
  group.add(bar2);
  return group;
}

function taperedLegs() {
  const group = new THREE.Group();
  const legH = 0.13;
  const positions = [
    [-LENGTH / 2 + 0.14, -WIDTH / 2 + 0.1],
    [LENGTH / 2 - 0.14, -WIDTH / 2 + 0.1],
    [-LENGTH / 2 + 0.14, WIDTH / 2 - 0.1],
    [LENGTH / 2 - 0.14, WIDTH / 2 - 0.1],
  ];
  for (const [x, z] of positions) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.04, legH, 8), wood);
    leg.position.set(x * 1.02, legH / 2, z * 1.02);
    leg.rotation.x = z > 0 ? 0.12 : -0.12;
    leg.rotation.z = x > 0 ? -0.1 : 0.1;
    group.add(leg);
  }
  const brace = new THREE.Mesh(new THREE.BoxGeometry(LENGTH * 0.7, 0.02, 0.02), metal);
  brace.position.y = legH + 0.02;
  group.add(brace);
  const brace2 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, WIDTH * 0.5), metal);
  brace2.position.y = legH + 0.02;
  group.add(brace2);
  return group;
}

function buildScene() {
  const root = new THREE.Group();
  root.name = 'BergenOvalCoffeeTable';

  root.add(flutedBody());
  root.add(drawers());
  root.add(taperedLegs());

  const topY = BODY_H + LIFT_GAP + TOP_THICK / 2;
  root.add(extrudedTop(topY, TOP_THICK));
  root.add(liftMechanism(topY));

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
console.log(`✓ Wrote ${outPath} (${(buffer.byteLength / 1024).toFixed(1)} KB) — Bergen Oval`);
