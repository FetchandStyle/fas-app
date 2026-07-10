'use client';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SelectionButton } from '@/components/ui/SelectionButton';
import { DEMO_BRANDS } from '@/lib/demo/kyc';
import type { KycData } from '@/lib/demo/kyc';

interface BrandStepProps {
  data: KycData;
  onUpdate: (data: Partial<KycData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const brandIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
  </svg>
);

export function BrandStep({ data, onUpdate, onNext, onBack }: BrandStepProps) {
  const toggleBrand = (brand: string) => {
    const current = data.brands || [];
    onUpdate({
      brands: current.includes(brand) ? current.filter((b) => b !== brand) : [...current, brand],
    });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#111827]">
          Favorite <span className="text-[#DB2777]">brands?</span>
        </h2>
        <p className="mt-1 text-sm text-[#6B7280]">Select the brands you love (optional).</p>
        {data.brands.length > 0 && (
          <span className="mt-2 inline-block rounded-full bg-[#FFF0F5] px-3 py-1 text-sm font-medium text-[#DB2777]">
            {data.brands.length} selected
          </span>
        )}
      </div>

      <div className="mb-6 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {DEMO_BRANDS.map((brand) => (
            <SelectionButton
              key={brand}
              label={brand}
              icon={brandIcon}
              selected={data.brands.includes(brand)}
              onClick={() => toggleBrand(brand)}
            />
          ))}
        </div>
      </div>

      <div className="mt-auto flex gap-3">
        <PrimaryButton onClick={onBack} variant="outline" className="flex-1">
          ← Back
        </PrimaryButton>
        <PrimaryButton onClick={onNext} className="flex-[2]">
          {data.brands.length === 0 ? 'Skip →' : 'Continue →'}
        </PrimaryButton>
      </div>
    </div>
  );
}
