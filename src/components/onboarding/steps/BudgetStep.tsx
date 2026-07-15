'use client';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import type { KycData } from '@/lib/demo/kyc';

interface BudgetStepProps {
  data: KycData;
  onUpdate: (data: Partial<KycData>) => void;
  onNext: () => void;
  onBack: () => void;
  saving?: boolean;
}

const PRESETS = [
  { label: 'Starter', min: 500, max: 2000, icon: '🌱' },
  { label: 'Standard', min: 2000, max: 5000, icon: '🏠' },
  { label: 'Premium', min: 5000, max: 15000, icon: '✨' },
  { label: 'Luxury', min: 15000, max: 50000, icon: '💎' },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function BudgetStep({ data, onUpdate, onNext, onBack, saving }: BudgetStepProps) {
  const handleChange = (key: 'min' | 'max', value: string) => {
    const num = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    onUpdate({ budget: { ...data.budget, [key]: num } });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#111827] sm:text-3xl">
          Set your <span className="text-[#DB2777]">budget</span>
        </h2>
        <p className="mt-1 text-sm text-[#6B7280]">We&apos;ll find the best options within your range.</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {PRESETS.map((preset) => {
          const selected = data.budget.min === preset.min && data.budget.max === preset.max;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => onUpdate({ budget: { min: preset.min, max: preset.max } })}
              className={`rounded-2xl border-2 p-4 text-center transition-all ${
                selected
                  ? 'border-[#DB2777] bg-[#FFF0F5] shadow-md'
                  : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB]'
              }`}
            >
              <span className="mb-2 block text-2xl">{preset.icon}</span>
              <span className={`block font-semibold ${selected ? 'text-[#DB2777]' : 'text-[#374151]'}`}>
                {preset.label}
              </span>
              <span className="text-xs text-[#9CA3AF]">
                {formatCurrency(preset.min)} – {formatCurrency(preset.max)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mb-6 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-5">
        <h3 className="mb-4 text-center text-sm font-semibold text-[#374151]">Or set a custom range</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-[#6B7280]">Minimum</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">$</span>
              <input
                type="text"
                value={data.budget.min.toLocaleString()}
                onChange={(e) => handleChange('min', e.target.value)}
                className="w-full rounded-xl border-2 border-[#E5E7EB] py-3 pl-7 pr-3 text-lg font-semibold outline-none focus:border-[#658EC2]"
              />
            </div>
          </div>
          <span className="mt-5 text-[#D1D5DB]">—</span>
          <div className="flex-1">
            <label className="mb-1 block text-xs text-[#6B7280]">Maximum</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">$</span>
              <input
                type="text"
                value={data.budget.max.toLocaleString()}
                onChange={(e) => handleChange('max', e.target.value)}
                className="w-full rounded-xl border-2 border-[#E5E7EB] py-3 pl-7 pr-3 text-lg font-semibold outline-none focus:border-[#658EC2]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto flex gap-3">
        <PrimaryButton onClick={onBack} variant="outline" className="flex-1" disabled={saving}>
          ← Back
        </PrimaryButton>
        <PrimaryButton
          onClick={onNext}
          variant="secondary"
          className="flex-[2]"
          disabled={data.budget.min <= 0 || data.budget.max <= data.budget.min || saving}
        >
          {saving ? 'Saving…' : 'Save & continue →'}
        </PrimaryButton>
      </div>
    </div>
  );
}
