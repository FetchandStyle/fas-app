'use client';

import { useEffect, useState } from 'react';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import type { KycData } from '@/lib/demo/kyc';

interface ElementStepProps {
  data: KycData;
  onUpdate: (data: Partial<KycData>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface Element {
  id: string;
  label: string;
  icon: string;
}

const FALLBACK: Element[] = [
  { id: 'sofa', label: 'Sofa', icon: '🛋️' },
  { id: 'coffee-table', label: 'Coffee Table', icon: '☕' },
  { id: 'rug', label: 'Rug', icon: '🏠' },
  { id: 'floor-lamp', label: 'Floor Lamp', icon: '💡' },
  { id: 'accent-chair', label: 'Accent Chair', icon: '🪑' },
  { id: 'wall-art', label: 'Wall Art', icon: '🖼️' },
];

export function ElementStep({ data, onUpdate, onNext, onBack }: ElementStepProps) {
  const [elements, setElements] = useState<Element[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (data.styles.length > 0) params.set('styles', data.styles.join(','));
    fetch(`/api/elements?${params}`)
      .then((r) => r.json())
      .then((result) => setElements(result.elements ?? FALLBACK))
      .catch(() => setElements(FALLBACK))
      .finally(() => setLoading(false));
  }, [data.styles]);

  const toggle = (label: string) => {
    const current = data.elements || [];
    onUpdate({
      elements: current.includes(label) ? current.filter((e) => e !== label) : [...current, label],
    });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#111827]">
          What <span className="text-[#DB2777]">items</span> do you need?
        </h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          {data.styles.length > 0 ? 'Recommended based on your style preferences.' : 'Select furniture and decor.'}
        </p>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F3F4F6] border-t-[#658EC2]" />
        </div>
      ) : (
        <div className="mb-4 grid flex-1 grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {elements.map((item) => {
            const selected = data.elements.includes(item.label);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggle(item.label)}
                className={`relative rounded-xl border-2 p-2 text-center transition-all sm:p-3 ${
                  selected ? 'border-[#DB2777] bg-[#FFF0F5]' : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB]'
                }`}
              >
                {selected && (
                  <div className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#DB2777] text-[10px] text-white">
                    ✓
                  </div>
                )}
                <span className="mb-1 block text-lg sm:text-xl">{item.icon}</span>
                <span className={`text-[10px] font-semibold sm:text-xs ${selected ? 'text-[#DB2777]' : 'text-[#374151]'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {data.elements.length > 0 && !loading && (
        <div className="mb-4 flex flex-wrap gap-2 rounded-xl border border-[#FCE7F3] bg-[#FFF0F5] p-3">
          {data.elements.map((el) => (
            <span key={el} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#DB2777] shadow-sm">
              {el}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex flex-col gap-2 sm:flex-row">
        <PrimaryButton onClick={onBack} variant="outline" className="sm:flex-1" size="sm">
          ← Back
        </PrimaryButton>
        <PrimaryButton onClick={onNext} disabled={data.elements.length === 0 || loading} className="sm:flex-[2]">
          Continue →
        </PrimaryButton>
      </div>
    </div>
  );
}
