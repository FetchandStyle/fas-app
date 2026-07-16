'use client';

import { useRef, useState } from 'react';
import ProductImage from '@/components/ui/ProductImage';
import { demoProductBySku } from '@/lib/demo/catalog';
import type { PlacedItem } from '@/lib/demo/roomBuilder';

interface RoomSceneIsoProps {
  zoom: number;
  placedItems: PlacedItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onMove: (id: string, x: number, y: number) => void;
  fallbackMessage?: string;
}

/** CSS isometric room — no WebGL required (works in VMs). */
export default function RoomSceneIso({
  zoom,
  placedItems,
  selectedId,
  onSelect,
  onMove,
  fallbackMessage,
}: RoomSceneIsoProps) {
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

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#E8EAED] to-[#DDE1E6]">
      <div className="room-iso-scene" style={{ transform: `scale(${zoom})` }}>
        <div className="room-iso-stage">
          <div className="room-iso-wall-back">
            <div className="room-iso-window" />
            <div className="room-iso-tv" />
            <div className="room-iso-frame room-iso-frame-left" />
            <div className="room-iso-frame room-iso-frame-right" />
          </div>
          <div className="room-iso-wall-side" />
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
                    <div className="relative h-full w-full">
                      <ProductImage
                        src={product.image_url}
                        alt={product.name}
                        objectFit="contain"
                        sizes="80px"
                      />
                    </div>
                    {selected && <span className="room-iso-selected-badge">Selected</span>}
                  </div>
                  <div className="room-iso-shadow" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {fallbackMessage && (
        <p className="pointer-events-none absolute bottom-3 left-1/2 max-w-md -translate-x-1/2 rounded-full bg-amber-50 px-3 py-1 text-center text-[10px] font-medium text-amber-800 shadow-sm ring-1 ring-amber-200">
          {fallbackMessage}
        </p>
      )}
    </div>
  );
}
