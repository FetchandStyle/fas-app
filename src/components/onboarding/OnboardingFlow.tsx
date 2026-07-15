'use client';

import { useEffect, useState } from 'react';
import {
  INITIAL_KYC_DATA,
  type KycData,
  loadKycData,
  saveKycData,
} from '@/lib/demo/kyc';
import { ProjectStep } from './steps/ProjectStep';
import { ScanRoomStep } from './steps/ScanRoomStep';
import { RoomDetailsStep } from './steps/RoomDetailsStep';
import { StyleStep } from './steps/StyleStep';
import { BrandStep } from './steps/BrandStep';
import { PriorityStep } from './steps/PriorityStep';
import { LookStep } from './steps/LookStep';
import { ElementStep } from './steps/ElementStep';
import { BudgetStep } from './steps/BudgetStep';

export type { KycData };

const STEPS = [
  { name: 'Project', icon: '🏠' },
  { name: 'Scan', icon: '📸' },
  { name: 'Details', icon: '📐' },
  { name: 'Style', icon: '✨' },
  { name: 'Brands', icon: '🏷️' },
  { name: 'Priority', icon: '⭐' },
  { name: 'Look', icon: '🎨' },
  { name: 'Elements', icon: '🛋️' },
  { name: 'Budget', icon: '💰' },
];

interface OnboardingFlowProps {
  initialData?: KycData;
  onCancel?: () => void;
  onComplete?: (data: KycData) => void;
}

export function OnboardingFlow({ initialData, onCancel, onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<KycData>(initialData ?? INITIAL_KYC_DATA);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const saved = loadKycData();
    if (saved && !initialData) {
      setData(saved);
    }
  }, [initialData]);

  const updateData = (updates: Partial<KycData>) => {
    setData((prev) => {
      const next = { ...prev, ...updates };
      saveKycData(next);
      return next;
    });
  };

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    setSaving(true);
    const completed: KycData = {
      ...data,
      completedAt: new Date().toISOString(),
    };
    saveKycData(completed);
    setSaving(false);
    onComplete?.(completed);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      onCancel?.();
    }
  };

  const renderStep = () => {
    const props = { data, onUpdate: updateData, onNext: handleNext, onBack: handleBack };
    switch (currentStep) {
      case 0:
        return <ProjectStep data={data} onUpdate={updateData} onNext={handleNext} />;
      case 1:
        return <ScanRoomStep {...props} />;
      case 2:
        return <RoomDetailsStep {...props} />;
      case 3:
        return <StyleStep {...props} />;
      case 4:
        return <BrandStep {...props} />;
      case 5:
        return <PriorityStep {...props} />;
      case 6:
        return <LookStep {...props} />;
      case 7:
        return <ElementStep {...props} />;
      case 8:
        return <BudgetStep {...props} saving={saving} />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#111827] sm:text-3xl">
            My Profile &amp; KYC
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Tell us about your style, room, and budget — we&apos;ll save your design profile.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-sm shadow-sm">
          <span className="font-bold text-[#658EC2]">{currentStep + 1}</span>
          <span className="text-[#9CA3AF]">/</span>
          <span className="text-[#6B7280]">{STEPS.length}</span>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
        <div className="relative mb-4 h-1.5 overflow-hidden rounded-full bg-[#F3F4F6]">
          <div
            className="absolute h-full rounded-full bg-[#658EC2] transition-all duration-500"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-between gap-1 overflow-x-auto pb-1">
          {STEPS.map((step, index) => (
            <div
              key={step.name}
              className={`flex min-w-0 flex-col items-center transition-opacity ${index <= currentStep ? 'opacity-100' : 'opacity-35'}`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs sm:h-8 sm:w-8 ${
                  index < currentStep
                    ? 'bg-emerald-500 text-white'
                    : index === currentStep
                      ? 'bg-[#DB2777] text-white ring-2 ring-[#DB2777]/20'
                      : 'bg-[#F3F4F6] text-[#9CA3AF]'
                }`}
              >
                {index < currentStep ? '✓' : step.icon}
              </div>
              <span
                className={`mt-1 hidden truncate text-[10px] font-medium sm:block ${
                  index === currentStep ? 'text-[#DB2777]' : 'text-[#6B7280]'
                }`}
              >
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-8">
        <div key={currentStep} className="animate-fade-in min-h-[420px]">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}
