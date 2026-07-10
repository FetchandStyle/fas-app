'use client';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SelectionButton } from '@/components/ui/SelectionButton';
import type { KycData } from '@/lib/demo/kyc';

interface ProjectStepProps {
  data: KycData;
  onUpdate: (data: Partial<KycData>) => void;
  onNext: () => void;
}

export function ProjectStep({ data, onUpdate, onNext }: ProjectStepProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 text-center sm:mb-8">
        <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0F5] text-2xl">
          🏠
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#111827] sm:text-3xl">
          What are your <span className="text-[#DB2777]">upcoming projects?</span>
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-[#6B7280]">
          Let&apos;s start by understanding your design goals.
        </p>
      </div>

      <div className="mb-6 grid flex-1 grid-cols-2 gap-3 sm:gap-4">
        <SelectionButton
          label="New Room"
          subtitle="Design from scratch"
          selected={data.projectType === 'new'}
          onClick={() => onUpdate({ projectType: 'new' })}
          imageSrc="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400&h=400"
        />
        <SelectionButton
          label="Existing Room"
          subtitle="Refresh your space"
          selected={data.projectType === 'existing'}
          onClick={() => onUpdate({ projectType: 'existing' })}
          imageSrc="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=400&h=400"
        />
      </div>

      <PrimaryButton onClick={onNext} disabled={!data.projectType} fullWidth>
        Get Started →
      </PrimaryButton>
    </div>
  );
}
