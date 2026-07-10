'use client';

import { useEffect, useState } from 'react';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import type { KycData } from '@/lib/demo/kyc';

interface ScanRoomStepProps {
  data: KycData;
  onUpdate: (data: Partial<KycData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ScanRoomStep({ data, onUpdate, onNext, onBack }: ScanRoomStepProps) {
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsScanning(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 text-center">
        <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0F4F8] text-2xl">
          📸
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#111827] sm:text-3xl">
          Scan your <span className="text-[#DB2777]">room</span>
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-[#6B7280]">
          Stand in the center and pan your camera around.
        </p>
      </div>

      <div className="relative mb-6 min-h-[280px] flex-1 overflow-hidden rounded-2xl bg-gray-900 shadow-lg">
        <img
          src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800"
          alt="Room scan preview"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-56 w-56 rounded-lg border-2 border-white/50">
            <div className="absolute -left-1 -top-1 h-6 w-6 rounded-tl border-l-4 border-t-4 border-[#DB2777]" />
            <div className="absolute -right-1 -top-1 h-6 w-6 rounded-tr border-r-4 border-t-4 border-[#DB2777]" />
            <div className="absolute -bottom-1 -left-1 h-6 w-6 rounded-bl border-b-4 border-l-4 border-[#DB2777]" />
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-br border-b-4 border-r-4 border-[#DB2777]" />
            {isScanning && <div className="kyc-scan-line absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#DB2777] to-transparent" />}
          </div>
        </div>
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 backdrop-blur-sm">
          <div className={`h-2 w-2 rounded-full ${isScanning ? 'animate-pulse bg-[#DB2777]' : 'bg-emerald-500'}`} />
          <span className="text-sm font-medium text-white">{isScanning ? 'Scanning…' : 'Ready'}</span>
        </div>
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-semibold text-[#374151]">Room Name</label>
        <input
          type="text"
          value={data.roomName}
          onChange={(e) => onUpdate({ roomName: e.target.value })}
          placeholder="e.g. Living Room, Bedroom…"
          className="w-full rounded-xl border-2 border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3.5 font-medium text-[#111827] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#658EC2]"
        />
      </div>

      <div className="mt-auto flex gap-3">
        <PrimaryButton onClick={onBack} variant="outline" className="flex-1">
          ← Back
        </PrimaryButton>
        <PrimaryButton onClick={onNext} disabled={!data.roomName || isScanning} className="flex-[2]">
          Save Room →
        </PrimaryButton>
      </div>
    </div>
  );
}
