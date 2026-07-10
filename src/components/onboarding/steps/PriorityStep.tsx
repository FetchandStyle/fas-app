'use client';

import { useEffect, useState } from 'react';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import type { KycData } from '@/lib/demo/kyc';

interface PriorityStepProps {
  data: KycData;
  onUpdate: (data: Partial<KycData>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface Priority {
  id: string;
  label: string;
  icon: string;
  description?: string;
}

const FALLBACK: Priority[] = [
  { id: 'price', label: 'Best Price', icon: '💵', description: 'Value for money' },
  { id: 'quality', label: 'Quality', icon: '⭐', description: 'Premium materials' },
  { id: 'style', label: 'Style First', icon: '✨', description: 'Aesthetic focus' },
  { id: 'comfort', label: 'Comfort', icon: '🛋️', description: 'Cozy living' },
];

export function PriorityStep({ data, onUpdate, onNext, onBack }: PriorityStepProps) {
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/priorities')
      .then((r) => r.json())
      .then((result) => setPriorities(result.priorities ?? FALLBACK))
      .catch(() => setPriorities(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: string) => {
    const current = data.priorities || [];
    onUpdate({
      priorities: current.includes(id) ? current.filter((p) => p !== id) : [...current, id],
    });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#111827]">
          What&apos;s <span className="text-[#DB2777]">important</span> to you?
        </h2>
        <p className="mt-1 text-sm text-[#6B7280]">Select your top priorities for this project.</p>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F3F4F6] border-t-[#658EC2]" />
        </div>
      ) : (
        <div className="mb-6 grid flex-1 grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {priorities.map((priority) => {
            const selected = data.priorities.includes(priority.id);
            return (
              <button
                key={priority.id}
                type="button"
                onClick={() => toggle(priority.id)}
                className={`relative rounded-xl border-2 p-3 text-left transition-all sm:p-4 ${
                  selected
                    ? 'border-[#DB2777] bg-[#FFF0F5] shadow-md'
                    : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB]'
                }`}
              >
                {selected && (
                  <div className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#DB2777] text-[10px] text-white">
                    ✓
                  </div>
                )}
                <span className="mb-1 block text-xl">{priority.icon}</span>
                <span className={`block text-sm font-semibold ${selected ? 'text-[#DB2777]' : 'text-[#374151]'}`}>
                  {priority.label}
                </span>
                {priority.description && (
                  <span className="text-xs text-[#9CA3AF]">{priority.description}</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-auto flex flex-col gap-2 sm:flex-row">
        <PrimaryButton onClick={onBack} variant="outline" className="sm:flex-1" size="sm">
          ← Back
        </PrimaryButton>
        <PrimaryButton onClick={onNext} disabled={data.priorities.length === 0 || loading} className="sm:flex-[2]">
          Continue →
        </PrimaryButton>
      </div>
    </div>
  );
}
