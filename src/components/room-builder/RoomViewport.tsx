'use client';

import { useRef, useState } from 'react';
import ProductImage from '@/components/ui/ProductImage';
import { demoProductBySku } from '@/lib/demo/catalog';
import type { PlacedItem } from '@/lib/demo/roomBuilder';

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

  if (viewMode === '2d') {
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
                    <ProductImage src={product.image_url} alt={product.name} objectFit="contain" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#E8EAED] to-[#DDE1E6]">
      <div
        className="room-iso-scene"
        style={{ transform: `scale(${zoom})` }}
      >
        <div className="room-iso-stage">
          {/* Back wall */}
          <div className="room-iso-wall-back">
            <div className="room-iso-window" />
            <div className="room-iso-tv" />
            <div className="room-iso-frame room-iso-frame-left" />
            <div className="room-iso-frame room-iso-frame-right" />
          </div>
          {/* Side wall */}
          <div className="room-iso-wall-side" />

          {/* Floor — drag surface */}
          <div
            ref={floorRef}
            className="room-iso-floor"
            onClick={() => onSelect(null)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {placedItems.map((item) => {
              const product = demoProductBySku(item.sku);
              if (!product) return null;
              const selected = selectedId === item.id;
              return (
                <div
                  key={item.id}
                  className={`room-iso-item ${draggingId === item.id ? 'is-dragging' : ''}`}
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})`,
                  }}
                  onPointerDown={(e) => handlePointerDown(e, item)}
                >
                  <div className={`room-iso-item-inner ${selected ? 'is-selected' : ''}`}>
                    <ProductImage
                      src={product.image_url}
                      alt={product.name}
                      objectFit="contain"
                      className="h-full w-full"
                    />
                    {selected && <span className="room-iso-selected-badge">Selected</span>}
                  </div>
                  <div className="room-iso-shadow" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
