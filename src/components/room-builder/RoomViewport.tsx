'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import ProductImage from '@/components/ui/ProductImage';
import { demoProductBySku } from '@/lib/demo/catalog';
import type { PlacedItem } from '@/lib/demo/roomBuilder';
import { isWebGLAvailable } from '@/lib/webgl';
import RoomSceneIso from './RoomSceneIso';

const RoomScene3D = dynamic(() => import('./RoomScene3D'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#E8EAED] to-[#DDE1E6]">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F3F4F6] border-t-[#658EC2]" />
    </div>
  ),
});

const WEBGL_FALLBACK_MSG =
  '3D models need WebGL — showing 2.5D view (common in VMware VMs). Use a real GPU or enable 3D acceleration.';

interface RoomViewportProps {
  viewMode: '2d' | '3d';
  zoom: number;
  placedItems: PlacedItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onMove: (id: string, x: number, y: number) => void;
}

export default function RoomViewport({
  viewMode,
  zoom,
  placedItems,
  selectedId,
  onSelect,
  onMove,
}: RoomViewportProps) {
  const floorRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; ox: number; oy: number } | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [webglOk, setWebglOk] = useState<boolean | null>(null);
  const [webglRuntimeFailed, setWebglRuntimeFailed] = useState(false);

  useEffect(() => {
    if (viewMode === '3d') {
      setWebglOk(isWebGLAvailable());
      setWebglRuntimeFailed(false);
    }
  }, [viewMode]);

  const handlePointerDown = (e: React.PointerEvent, item: PlacedItem) => {
    e.stopPropagation();
    const rect = floorRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragRef.current = {
      id: item.id,
      ox: e.clientX - rect.left - (item.x / 100) * rect.width,
      oy: e.clientY - rect.top - (item.y / 100) * rect.height,
    };
    setDraggingId(item.id);
    onSelect(item.id);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || !floorRef.current) return;
    const rect = floorRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left - dragRef.current.ox) / rect.width) * 100;
    const y = ((e.clientY - rect.top - dragRef.current.oy) / rect.height) * 100;
    onMove(
      dragRef.current.id,
      Math.min(90, Math.max(10, x)),
      Math.min(85, Math.max(15, y)),
    );
  };

  const handlePointerUp = () => {
    dragRef.current = null;
    setDraggingId(null);
  };

  if (viewMode === '3d') {
    const useIsoFallback = webglOk === false || webglRuntimeFailed;

    if (useIsoFallback) {
      return (
        <RoomSceneIso
          zoom={zoom}
          placedItems={placedItems}
          selectedId={selectedId}
          onSelect={onSelect}
          onMove={onMove}
          fallbackMessage={WEBGL_FALLBACK_MSG}
        />
      );
    }

    if (webglOk === null) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#E8EAED] to-[#DDE1E6]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F3F4F6] border-t-[#658EC2]" />
        </div>
      );
    }

    return (
      <RoomScene3D
        placedItems={placedItems}
        selectedId={selectedId}
        zoom={zoom}
        onSelect={onSelect}
        onMove={onMove}
        onWebGLError={() => setWebglRuntimeFailed(true)}
      />
    );
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#E8EAED] p-4">
      <div
        ref={floorRef}
        className="relative aspect-square w-full max-w-[520px] select-none rounded-lg border-2 border-[#D1D5DB] bg-[#FAFAF8] shadow-inner"
        style={{
          transform: `scale(${zoom})`,
          backgroundImage:
            'linear-gradient(#E5E7EB 1px, transparent 1px), linear-gradient(90deg, #E5E7EB 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        onClick={() => onSelect(null)}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="absolute inset-[8%] rounded border-2 border-dashed border-[#DB2777]/40 bg-white/50" />
        {placedItems.map((item) => {
          const product = demoProductBySku(item.sku);
          if (!product) return null;
          const selected = selectedId === item.id;
          return (
            <div
              key={item.id}
              className={`absolute touch-none ${draggingId === item.id ? 'z-30' : 'z-20'}`}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale * 0.7})`,
              }}
              onPointerDown={(e) => handlePointerDown(e, item)}
            >
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border-2 bg-white p-1 shadow-md sm:h-16 sm:w-16 ${
                  selected ? 'border-[#DB2777]' : 'border-[#E5E7EB]'
                }`}
              >
                <div className="relative h-full w-full">
                  <ProductImage
                    src={product.image_url}
                    alt={product.name}
                    objectFit="contain"
                    sizes="64px"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
