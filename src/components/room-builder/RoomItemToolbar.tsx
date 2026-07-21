'use client';

import { demoProductBySku } from '@/lib/demo/catalog';
import { formatLiftHeight, formatScalePercent, type PlacedItem } from '@/lib/demo/roomBuilder';

interface RoomItemToolbarProps {
  item: PlacedItem;
  onRotate: (delta: number) => void;
  onLift: (delta: number) => void;
  onScale: (delta: number) => void;
  onRemove: () => void;
  onDeselect: () => void;
}

export default function RoomItemToolbar({
  item,
  onRotate,
  onLift,
  onScale,
  onRemove,
  onDeselect,
}: RoomItemToolbarProps) {
  const product = demoProductBySku(item.sku);
  const name = product?.name.split(' ').slice(0, 3).join(' ') ?? item.sku;

  return (
    <div className="absolute left-1/2 top-4 z-20 flex -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm">
      <span className="max-w-[140px] truncate text-xs font-semibold text-[#111827] sm:max-w-[200px]">
        {name}
      </span>
      <div className="h-5 w-px bg-[#E5E7EB]" />
      <button
        type="button"
        onClick={() => onRotate(-15)}
        className="rounded-lg border border-[#E5E7EB] px-2.5 py-1.5 text-xs font-bold text-[#374151] hover:bg-[#F9FAFB]"
        title="Rotate left 15° (Q)"
      >
        ↺
      </button>
      <span className="min-w-[2.5rem] text-center text-xs font-medium text-[#6B7280]">
        {Math.round(item.rotation)}°
      </span>
      <button
        type="button"
        onClick={() => onRotate(15)}
        className="rounded-lg border border-[#E5E7EB] px-2.5 py-1.5 text-xs font-bold text-[#374151] hover:bg-[#F9FAFB]"
        title="Rotate right 15° (E)"
      >
        ↻
      </button>
      <div className="h-5 w-px bg-[#E5E7EB]" />
      <button
        type="button"
        onClick={() => onLift(-0.12)}
        className="rounded-lg border border-[#E5E7EB] px-2.5 py-1.5 text-xs font-bold text-[#374151] hover:bg-[#F9FAFB]"
        title="Lower (F)"
      >
        ↓
      </button>
      <span className="min-w-[3rem] text-center text-xs font-medium text-[#6B7280]">
        {formatLiftHeight(item.lift)}
      </span>
      <button
        type="button"
        onClick={() => onLift(0.12)}
        className="rounded-lg border border-[#E5E7EB] px-2.5 py-1.5 text-xs font-bold text-[#374151] hover:bg-[#F9FAFB]"
        title="Raise (R)"
      >
        ↑
      </button>
      <div className="h-5 w-px bg-[#E5E7EB]" />
      <button
        type="button"
        onClick={() => onScale(-0.1)}
        className="rounded-lg border border-[#E5E7EB] px-2.5 py-1.5 text-xs font-bold text-[#374151] hover:bg-[#F9FAFB]"
        title="Smaller (-)"
      >
        −
      </button>
      <span className="min-w-[3rem] text-center text-xs font-medium text-[#6B7280]">
        {formatScalePercent(item.scale)}
      </span>
      <button
        type="button"
        onClick={() => onScale(0.1)}
        className="rounded-lg border border-[#E5E7EB] px-2.5 py-1.5 text-xs font-bold text-[#374151] hover:bg-[#F9FAFB]"
        title="Larger (+)"
      >
        +
      </button>
      <div className="h-5 w-px bg-[#E5E7EB]" />
      <button
        type="button"
        onClick={onRemove}
        className="rounded-lg px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
        title="Remove"
      >
        Remove
      </button>
      <button
        type="button"
        onClick={onDeselect}
        className="rounded-lg px-2 py-1.5 text-xs text-[#6B7280] hover:bg-[#F9FAFB]"
        title="Deselect (Esc)"
      >
        ✕
      </button>
    </div>
  );
}
