'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { DEMO_USER } from '@/lib/demo/dashboard';
import { type KycData, kycSearchResultsPath } from '@/lib/demo/kyc';

interface ProfileSummaryProps {
  data: KycData;
  onEdit: () => void;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 border-b border-[#F3F4F6] py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium text-[#6B7280]">{label}</span>
      <span className="text-sm font-semibold text-[#111827]">{value}</span>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

export function ProfileSummary({ data, onEdit }: ProfileSummaryProps) {
  const completedDate = data.completedAt
    ? new Date(data.completedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <section className="mb-6 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={DEMO_USER.avatarUrl}
              alt={DEMO_USER.displayName}
              width={72}
              height={72}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-pink-100 sm:h-[72px] sm:w-[72px]"
            />
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#111827]">{DEMO_USER.displayName}</h1>
              <p className="text-sm text-[#6B7280]">{DEMO_USER.email}</p>
              {completedDate && (
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  KYC completed {completedDate}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <PrimaryButton onClick={onEdit} variant="outline" size="sm">
              Update preferences
            </PrimaryButton>
            <Link
              href="/dashboard"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#DB2777] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#BE185D] sm:w-auto"
            >
              Go to dashboard →
            </Link>
            <Link
              href={kycSearchResultsPath(data)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-semibold text-[#658EC2] transition-colors hover:bg-[#F9FAFB] sm:w-auto"
            >
              Search your style →
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-4 font-serif text-lg font-bold text-[#111827]">Your design profile</h2>
        <div className="divide-y divide-[#F3F4F6]">
          <SummaryRow
            label="Project type"
            value={data.projectType === 'new' ? 'New Room' : data.projectType === 'existing' ? 'Existing Room' : ''}
          />
          <SummaryRow label="Room" value={data.roomName} />
          <SummaryRow
            label="Dimensions"
            value={
              data.roomName
                ? `${data.roomDimensions.width}' × ${data.roomDimensions.length}' × ${data.roomDimensions.height}'`
                : ''
            }
          />
          <SummaryRow label="Styles" value={data.styles.join(', ')} />
          <SummaryRow label="Brands" value={data.brands.join(', ')} />
          <SummaryRow label="Priorities" value={data.priorities.join(', ')} />
          <SummaryRow label="Items needed" value={data.elements.join(', ')} />
          <SummaryRow
            label="Budget"
            value={`${formatCurrency(data.budget.min)} – ${formatCurrency(data.budget.max)}`}
          />
        </div>
      </section>
    </div>
  );
}
