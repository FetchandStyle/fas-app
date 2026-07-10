'use client';

import Link from 'next/link';
import { formatFeet, type RoomDimensions } from '@/lib/demo/roomBuilder';

interface RoomSummaryBarProps {
  dimensions: RoomDimensions;
  itemCount: number;
  productCount: number;
  total: number;
  onViewList: () => void;
}

export default function RoomSummaryBar({
  dimensions,
  itemCount,
  productCount,
  total,
  onViewList,
}: RoomSummaryBarProps) {
  return (
    <footer className="shrink-0 border-t border-[#E5E7EB] bg-white px-3 py-2 sm:px-5">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm">
            <span className="font-bold uppercase tracking-wide text-[#9CA3AF]">Dimensions</span>
            <span>
              <strong className="text-[#111827]">W</strong>{' '}
              <span className="text-[#374151]">{formatFeet(dimensions.width)}</span>
            </span>
            <span>
              <strong className="text-[#111827]">D</strong>{' '}
              <span className="text-[#374151]">{formatFeet(dimensions.depth)}</span>
            </span>
            <span>
              <strong className="text-[#111827]">H</strong>{' '}
              <span className="text-[#374151]">{formatFeet(dimensions.height)}</span>
            </span>
          </div>
          <button
            type="button"
            className="rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB] sm:text-sm"
          >
            Edit Room
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#374151]">
            <span>
              <strong>{itemCount}</strong> Items
            </span>
            <span>
              <strong>{productCount}</strong> Products
            </span>
            <span className="font-bold text-[#111827]">
              Est. Total: <span className="text-[#DB2777]">${total.toLocaleString()}</span>
            </span>
          </div>
          <button
            type="button"
            onClick={onViewList}
            className="rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB] sm:text-sm"
          >
            View List
          </button>
          <Link
            href="/score"
            className="rounded-lg bg-[#DB2777] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#BE185D] sm:text-sm"
          >
            AI Score →
          </Link>
        </div>
      </div>
    </footer>
  );
}
