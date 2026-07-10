'use client';

import { useEffect, useState } from 'react';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SelectionButton } from '@/components/ui/SelectionButton';
import type { KycData } from '@/lib/demo/kyc';

interface StyleStepProps {
  data: KycData;
  onUpdate: (data: Partial<KycData>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface Style {
  id: string;
  label: string;
  image: string;
  description?: string;
}

const FALLBACK_STYLES: Style[] = [
  { id: 'modern', label: 'Modern', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400' },
  { id: 'traditional', label: 'Traditional', image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=400' },
  { id: 'minimalist', label: 'Minimalist', image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=400' },
  { id: 'industrial', label: 'Industrial', image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&q=80&w=400' },
];

export function StyleStep({ data, onUpdate, onNext, onBack }: StyleStepProps) {
  const [styles, setStyles] = useState<Style[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/styles')
      .then((r) => r.json())
      .then((result) => setStyles(result.styles ?? FALLBACK_STYLES))
      .catch(() => setStyles(FALLBACK_STYLES))
      .finally(() => setLoading(false));
  }, []);

  const toggleStyle = (styleId: string) => {
    const current = data.styles || [];
    onUpdate({
      styles: current.includes(styleId)
        ? current.filter((id) => id !== styleId)
        : [...current, styleId],
    });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#111827]">
          What&apos;s your <span className="text-[#DB2777]">style?</span>
        </h2>
        <p className="mt-1 text-sm text-[#6B7280]">Select all the styles that inspire you.</p>
        {data.styles.length > 0 && (
          <span className="mt-2 inline-block rounded-full bg-[#FFF0F5] px-3 py-1 text-sm font-medium text-[#DB2777]">
            {data.styles.length} selected
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F3F4F6] border-t-[#658EC2]" />
        </div>
      ) : (
        <div className="mb-6 flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {styles.map((style) => (
              <SelectionButton
                key={style.id}
                label={style.label}
                imageSrc={style.image}
                subtitle={style.description}
                selected={data.styles.includes(style.id)}
                onClick={() => toggleStyle(style.id)}
                compact
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto flex flex-col gap-2 sm:flex-row">
        <PrimaryButton onClick={onBack} variant="outline" className="sm:flex-1" size="sm">
          ← Back
        </PrimaryButton>
        <PrimaryButton onClick={onNext} disabled={data.styles.length === 0 || loading} className="sm:flex-[2]">
          Continue →
        </PrimaryButton>
      </div>
    </div>
  );
}
