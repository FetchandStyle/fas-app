'use client';

import { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, type ThreeEvent } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls, useGLTF } from '@react-three/drei';
import type { Mesh } from 'three';
import { ALL_DEMO_GLB_PATHS, getModel3DForSku } from '@/lib/demo/models3d';
import type { PlacedItem } from '@/lib/demo/roomBuilder';

const FLOOR_SIZE = 10;
const FLOOR_HALF = FLOOR_SIZE / 2;

ALL_DEMO_GLB_PATHS.forEach((url) => useGLTF.preload(url));

function pctToWorld(pct: number) {
  return (pct / 100) * FLOOR_SIZE - FLOOR_HALF;
}

function worldToPct(pos: number) {
  return ((pos + FLOOR_HALF) / FLOOR_SIZE) * 100;
}

function clampPct(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

interface FurnitureMeshProps {
  item: PlacedItem;
  selected: boolean;
  onSelect: (id: string) => void;
  onDragStart: (id: string) => void;
}

function FurnitureMesh({ item, selected, onSelect, onDragStart }: FurnitureMeshProps) {
  const config = getModel3DForSku(item.sku);
  const { scene } = useGLTF(config.glb);
  const model = useMemo(() => scene.clone(true), [scene]);
  const x = pctToWorld(item.x);
  const z = pctToWorld(item.y);
  const scale = item.scale * config.baseScale;
  const rotY = (item.rotation * Math.PI) / 180;

  return (
    <group
      position={[x, config.yOffset, z]}
      rotation={[0, rotY, 0]}
      scale={scale}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onSelect(item.id);
        onDragStart(item.id);
      }}
    >
      <primitive object={model} />
      {selected && (
        <mesh position={[0, 0.6, 0]}>
          <ringGeometry args={[0.55, 0.62, 32]} />
          <meshBasicMaterial color="#DB2777" transparent opacity={0.85} />
        </mesh>
      )}
    </group>
  );
}

interface SceneContentProps {
  placedItems: PlacedItem[];
  selectedId: string | null;
  zoom: number;
  onSelect: (id: string | null) => void;
  onMove: (id: string, x: number, y: number) => void;
}

function SceneContent({ placedItems, selectedId, zoom, onSelect, onMove }: SceneContentProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const floorRef = useRef<Mesh>(null);

  const handleFloorPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!draggingId) return;
    e.stopPropagation();
    const x = clampPct(worldToPct(e.point.x), 10, 90);
    const y = clampPct(worldToPct(e.point.z), 15, 85);
    onMove(draggingId, x, y);
  };

  const endDrag = () => setDraggingId(null);

  return (
    <group scale={zoom}>
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 10, 4]} intensity={1.1} castShadow />

      {/* Floor */}
      <mesh
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        onPointerDown={() => onSelect(null)}
        onPointerMove={handleFloorPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        <planeGeometry args={[FLOOR_SIZE, FLOOR_SIZE]} />
        <meshStandardMaterial color="#c4a574" roughness={0.85} />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 1.5, -FLOOR_HALF]} receiveShadow>
        <boxGeometry args={[FLOOR_SIZE, 3, 0.12]} />
        <meshStandardMaterial color="#f5f5f2" />
      </mesh>
      <mesh position={[-FLOOR_HALF, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[FLOOR_SIZE, 3, 0.12]} />
        <meshStandardMaterial color="#ebebe8" />
      </mesh>

      {placedItems.map((item) => (
        <FurnitureMesh
          key={item.id}
          item={item}
          selected={selectedId === item.id}
          onSelect={(id) => onSelect(id)}
          onDragStart={setDraggingId}
        />
      ))}

      <ContactShadows position={[0, 0.01, 0]} opacity={0.35} scale={12} blur={2.5} far={6} />
      <Environment preset="apartment" />
      <OrbitControls
        makeDefault
        enablePan
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={6}
        maxDistance={18}
        target={[0, 0.5, 0]}
      />
    </group>
  );
}

interface RoomScene3DProps {
  placedItems: PlacedItem[];
  selectedId: string | null;
  zoom: number;
  onSelect: (id: string | null) => void;
  onMove: (id: string, x: number, y: number) => void;
  onWebGLError?: () => void;
}

export default function RoomScene3D({
  placedItems,
  selectedId,
  zoom,
  onSelect,
  onMove,
  onWebGLError,
}: RoomScene3DProps) {
  return (
    <div className="relative h-full w-full bg-gradient-to-b from-[#E8EAED] to-[#DDE1E6]">
      <Canvas
        shadows
        camera={{ position: [7, 7, 7], fov: 42 }}
        className="touch-none"
        onPointerMissed={() => onSelect(null)}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', () => onWebGLError?.());
        }}
      >
        <Suspense fallback={null}>
          <SceneContent
            placedItems={placedItems}
            selectedId={selectedId}
            zoom={zoom}
            onSelect={onSelect}
            onMove={onMove}
          />
        </Suspense>
      </Canvas>
      <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium text-[#6B7280] shadow-sm">
        Sample 3D models (Khronos CC0) · drag to move · orbit to rotate view
      </p>
    </div>
  );
}
