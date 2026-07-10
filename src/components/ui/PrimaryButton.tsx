'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function PrimaryButton({
  children,
  className = '',
  fullWidth = false,
  disabled,
  variant = 'primary',
  size = 'md',
  ...props
}: PrimaryButtonProps) {
  const sizeStyles = {
    sm: 'py-2.5 px-5 text-sm',
    md: 'py-3.5 px-6 text-sm',
    lg: 'py-4 px-8 text-base',
  };

  const variantStyles = {
    primary:
      'bg-[#658EC2] text-white hover:bg-[#4a6fa3] shadow-md shadow-[#658EC2]/20 active:scale-[0.98]',
    secondary:
      'bg-[#DB2777] text-white hover:bg-[#BE185D] shadow-md shadow-[#DB2777]/20 active:scale-[0.98]',
    outline:
      'bg-white text-[#374151] border-2 border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F9FAFB] active:scale-[0.98]',
    ghost: 'bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB] active:scale-[0.98]',
  };

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
