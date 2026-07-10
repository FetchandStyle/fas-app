'use client';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import type { KycData } from '@/lib/demo/kyc';

interface RoomDetailsStepProps {
  data: KycData;
  onUpdate: (data: Partial<KycData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function RoomDetailsStep({ data, onUpdate, onNext, onBack }: RoomDetailsStepProps) {
  const handleDimensionChange = (key: keyof KycData['roomDimensions'], value: string) => {
    onUpdate({
      roomDimensions: {
        ...data.roomDimensions,
        [key]: parseFloat(value) || 0,
      },
    });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 text-center">
        <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F3FF] text-2xl">
          📐
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#111827] sm:text-3xl">
          Confirm <span className="text-[#DB2777]">dimensions</span>
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-[#6B7280]">
          We&apos;ve estimated these from your scan. Adjust if needed.
        </p>
      </div>

      <div className="relative mb-6 flex min-h-[200px] flex-1 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-gradient-to-br from-[#F9FAFB] to-white">
        <div className="relative">
          <div className="relative h-40 w-40">
            <div className="absolute h-24 w-40 skew-x-12 skew-y-6 rounded bg-gradient-to-br from-[#E5E7EB] to-[#D1D5DB] shadow-md" />
            <div className="absolute -top-16 left-3 h-28 w-32 skew-y-6 rounded border-l-4 border-[#DB2777]/30 bg-gradient-to-t from-[#E5E7EB] to-[#F9FAFB]" />
            <div className="absolute -top-16 right-0 h-28 w-20 -skew-x-6 rounded border-r-4 border-[#DB2777]/30 bg-gradient-to-r from-[#F3F4F6] to-[#F9FAFB]" />
          </div>
          <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 shadow-sm">
            <span className="font-bold text-[#DB2777]">{data.roomDimensions.width}&apos;</span>
            <span className="text-xs text-[#9CA3AF]">W</span>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3">
        {(['height', 'width', 'length'] as const).map((key) => (
          <div key={key} className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">{key}</label>
            <div className="relative">
              <input
                type="number"
                value={data.roomDimensions[key]}
                onChange={(e) => handleDimensionChange(key, e.target.value)}
                className="w-full rounded-xl border-2 border-[#E5E7EB] bg-[#F9FAFB] py-3 text-center text-lg font-bold text-[#111827] outline-none focus:border-[#658EC2]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#9CA3AF]">ft</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto flex gap-3">
        <PrimaryButton onClick={onBack} variant="outline" className="flex-1">
          ← Back
        </PrimaryButton>
        <PrimaryButton onClick={onNext} className="flex-[2]">
          Confirm →
        </PrimaryButton>
      </div>
    </div>
  );
}
