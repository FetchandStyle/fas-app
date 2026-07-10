'use client';

import type { ReactNode } from 'react';

interface SelectionButtonProps {
  label: string;
  selected?: boolean;
  onClick: () => void;
  imageSrc?: string;
  className?: string;
  icon?: ReactNode;
  subtitle?: string;
  compact?: boolean;
}

export function SelectionButton({
  label,
  selected = false,
  onClick,
  imageSrc,
  className = '',
  icon,
  subtitle,
  compact = false,
}: SelectionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border-2 transition-all duration-200 ${compact ? 'p-2 sm:p-3' : 'p-2 sm:p-3 md:p-4'} ${
        selected
          ? 'border-[#DB2777] bg-[#FFF0F5] shadow-md shadow-pink-100/50'
          : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB] hover:shadow-sm'
      } ${className}`}
    >
      {selected && (
        <div className="absolute right-1.5 top-1.5 z-10 sm:right-2 sm:top-2">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#DB2777] shadow-sm sm:h-5 sm:w-5">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="h-2.5 w-2.5 sm:h-3 sm:w-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        </div>
      )}

      {imageSrc && (
        <div className={`relative mb-1.5 w-full overflow-hidden rounded-lg sm:mb-2 ${compact ? 'aspect-[4/3]' : 'aspect-[4/3] sm:aspect-square'}`}>
          <img
            src={imageSrc}
            alt={label}
            className={`h-full w-full object-cover transition-transform duration-300 ${selected ? 'scale-105' : 'group-hover:scale-105'}`}
          />
        </div>
      )}

      {icon && !imageSrc && (
        <div
          className={`mb-1.5 flex h-10 w-10 items-center justify-center rounded-xl transition-all sm:mb-2 sm:h-12 sm:w-12 ${
            selected ? 'bg-[#DB2777] text-white shadow-md' : 'bg-[#F3F4F6] text-[#6B7280] group-hover:bg-[#E5E7EB]'
          }`}
        >
          {icon}
        </div>
      )}

      <span
        className={`text-center text-xs font-semibold leading-tight sm:text-sm ${
          selected ? 'text-[#DB2777]' : 'text-[#374151] group-hover:text-[#111827]'
        }`}
      >
        {label}
      </span>

      {subtitle && (
        <span className={`mt-0.5 text-center text-[10px] sm:text-xs ${selected ? 'text-[#BE185D]/80' : 'text-[#9CA3AF]'}`}>
          {subtitle}
        </span>
      )}
    </button>
  );
}
