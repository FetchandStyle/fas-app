'use client';

import { useEffect, useState } from 'react';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { ProfileSummary } from '@/components/profile/ProfileSummary';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { DEMO_USER } from '@/lib/demo/dashboard';
import {
  INITIAL_KYC_DATA,
  type KycData,
  isKycComplete,
  loadKycData,
} from '@/lib/demo/kyc';
import Image from 'next/image';

type ViewMode = 'loading' | 'intro' | 'quiz' | 'summary';

export default function ProfilePageClient() {
  const [mode, setMode] = useState<ViewMode>('loading');
  const [kycData, setKycData] = useState<KycData | null>(null);

  useEffect(() => {
    const saved = loadKycData();
    setKycData(saved);
    if (isKycComplete(saved)) {
      setMode('summary');
    } else if (saved?.projectType) {
      setMode('quiz');
    } else {
      setMode('intro');
    }
  }, []);

  if (mode === 'loading') {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F3F4F6] border-t-[#658EC2]" />
      </div>
    );
  }

  if (mode === 'intro') {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-lg rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center shadow-sm">
          <Image
            src={DEMO_USER.avatarUrl}
            alt={DEMO_USER.displayName}
            width={80}
            height={80}
            className="mx-auto mb-4 h-20 w-20 rounded-full object-cover ring-2 ring-pink-100"
          />
          <h1 className="font-serif text-2xl font-bold text-[#111827]">Complete your KYC profile</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">
            Answer a few quick questions about your style, room, and budget. Your profile is saved
            here — search and room builder use it when you&apos;re ready.
          </p>
          <p className="mt-2 text-xs text-[#9CA3AF]">Takes about 3 minutes · saved locally for demo</p>
          <PrimaryButton className="mt-8" fullWidth onClick={() => setMode('quiz')}>
            Start KYC quiz →
          </PrimaryButton>
        </div>
      </div>
    );
  }

  if (mode === 'quiz') {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <OnboardingFlow
          initialData={kycData ?? INITIAL_KYC_DATA}
          onCancel={() => setMode(isKycComplete(kycData) ? 'summary' : 'intro')}
          onComplete={(data) => {
            setKycData(data);
            setMode('summary');
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ProfileSummary
        data={kycData ?? INITIAL_KYC_DATA}
        onEdit={() => setMode('quiz')}
      />
    </div>
  );
}
