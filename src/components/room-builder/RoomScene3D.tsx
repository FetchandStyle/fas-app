'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, type ThreeEvent } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { MOUSE, type Mesh } from 'three';
import DemoRoom from '@/components/room-builder/DemoRoom';
import {
  ALL_DEMO_GLB_PATHS,
  ROOM_RUG_GLB,
  getModel3DForSku,
} from '@/lib/demo/models3d';
import { clampLift, type PlacedItem } from '@/lib/demo/roomBuilder';

const FLOOR_SIZE = 10;
const FLOOR_HALF = FLOOR_SIZE / 2;

ALL_DEMO_GLB_PATHS.forEach((url) => useGLTF.preload(url));
useGLTF.preload(ROOM_RUG_GLB);

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
  onLiftStart: (id: string, clientY: number, lift: number) => void;
}

function FurnitureMesh({
  item,
  selected,
  onSelect,
  onDragStart,
  onLiftStart,
}: FurnitureMeshProps) {
  const config = getModel3DForSku(item.sku);
  const { scene } = useGLTF(config.glb);
  const model = useMemo(() => scene.clone(true), [scene]);
  const x = pctToWorld(item.x);
  const z = pctToWorld(item.y);
  const scale = item.scale * config.baseScale;
  const rotY = (item.rotation * Math.PI) / 180;
  const lift = item.lift ?? 0;
  const worldY = config.yOffset + lift;

  return (
    <group
      position={[x, worldY, z]}
      rotation={[0, rotY, 0]}
      scale={scale}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onSelect(item.id);
        if (e.shiftKey) {
          onLiftStart(item.id, e.clientY, lift);
        } else {
          onDragStart(item.id);
        }
      }}
    >
      {lift > 0.05 && (
        <mesh position={[0, -lift / scale / 2, 0]}>
          <boxGeometry args={[0.03, lift / scale, 0.03]} />
          <meshBasicMaterial color="#DB2777" transparent opacity={0.35} />
        </mesh>
      )}
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

function RoomRug() {
  const { scene } = useGLTF(ROOM_RUG_GLB);
  const model = useMemo(() => scene.clone(true), [scene]);
  return (
    <group position={[0.5, 0.02, 0.8]} scale={1.6} rotation={[0, Math.PI / 2, 0]}>
      <primitive object={model} />
    </group>
  );
}

interface SceneContentProps {
  placedItems: PlacedItem[];
  selectedId: string | null;
  zoom: number;
  onSelect: (id: string | null) => void;
  onMove: (id: string, x: number, y: number) => void;
  onLift?: (id: string, lift: number) => void;
}

function SceneContent({
  placedItems,
  selectedId,
  zoom,
  onSelect,
  onMove,
  onLift,
}: SceneContentProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [liftingId, setLiftingId] = useState<string | null>(null);
  const liftDragRef = useRef({ clientY: 0, lift: 0 });
  const floorRef = useRef<Mesh>(null);

  useEffect(() => {
    if (!liftingId || !onLift) return;

    const handleMove = (e: PointerEvent) => {
      const delta = (liftDragRef.current.clientY - e.clientY) * 0.008;
      onLift(liftingId, clampLift(liftDragRef.current.lift + delta));
    };
    const handleUp = () => setLiftingId(null);

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [liftingId, onLift]);

  const handleFloorPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!draggingId) return;
    e.stopPropagation();
    const x = clampPct(worldToPct(e.point.x), 12, 88);
    const y = clampPct(worldToPct(e.point.z), 18, 82);
    onMove(draggingId, x, y);
  };

  const endDrag = () => setDraggingId(null);

  const handleLiftStart = (id: string, clientY: number, lift: number) => {
    liftDragRef.current = { clientY, lift };
    setLiftingId(id);
  };

  return (
    <group scale={zoom}>
      <ambientLight intensity={0.65} />
      <directionalLight position={[5, 9, 3]} intensity={1.25} castShadow />
      <directionalLight position={[-4, 6, -2]} intensity={0.35} />

      <DemoRoom />
      <RoomRug />

      <mesh
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.03, 0]}
        onPointerDown={() => onSelect(null)}
        onPointerMove={handleFloorPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        <planeGeometry args={[FLOOR_SIZE, FLOOR_SIZE]} />
        <meshStandardMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {placedItems.map((item) => (
        <FurnitureMesh
          key={item.id}
          item={item}
          selected={selectedId === item.id}
          onSelect={(id) => onSelect(id)}
          onDragStart={setDraggingId}
          onLiftStart={handleLiftStart}
        />
      ))}

      <ContactShadows position={[0, 0.02, 0]} opacity={0.45} scale={14} blur={2} far={8} />
      <Environment preset="apartment" />
      <OrbitControls
        makeDefault
        enabled={!draggingId && !liftingId}
        enablePan
        mouseButtons={{
          LEFT: null as unknown as MOUSE,
          MIDDLE: MOUSE.DOLLY,
          RIGHT: MOUSE.ROTATE,
        }}
        minPolarAngle={0.4}
        maxPolarAngle={Math.PI / 2.15}
        minDistance={7}
        maxDistance={16}
        target={[0, 0.8, 0]}
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
  onLift?: (id: string, lift: number) => void;
  onWebGLError?: () => void;
}

export default function RoomScene3D({
  placedItems,
  selectedId,
  zoom,
  onSelect,
  onMove,
  onLift,
  onWebGLError,
}: RoomScene3DProps) {
  return (
    <div className="relative h-full w-full bg-gradient-to-b from-[#E8EAED] to-[#DDE1E6]">
      <Canvas
        shadows
        camera={{ position: [8, 7, 8], fov: 40 }}
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
            onLift={onLift}
          />
        </Suspense>
      </Canvas>
      <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium text-[#6B7280] shadow-sm">
        Move: left-drag · Orbit: right-drag · Rotate: Q/E · Lift: R/F or Shift+drag up
      </p>
    </div>
  );
}
