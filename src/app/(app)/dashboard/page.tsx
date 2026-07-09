import Image from 'next/image';
import Link from 'next/link';
import {
  DEMO_ROOM_SCANS,
  DEMO_USER,
  DEMO_WISHLIST,
} from '@/lib/demo/dashboard';

function DashboardCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeader({
  title,
  href,
}: {
  title: string;
  href: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-[17px] font-bold text-[#111827]">{title}</h2>
      <Link
        href={href}
        className="text-sm font-semibold text-[#DB2777] hover:text-[#BE185D]"
      >
        View all
      </Link>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  iconClassName = 'text-[#111827]',
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  iconClassName?: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3.5">
      <span className={`shrink-0 ${iconClassName}`}>{icon}</span>
      <div className="min-w-0">
        <p className="text-xl font-bold leading-tight text-[#111827]">{value}</p>
        <p className="truncate text-xs text-[#6B7280]">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Top row: welcome + stats | scans */}
      <div className="mb-6 grid gap-6 xl:grid-cols-2">
        {/* Left — welcome + 3 stat cards */}
        <DashboardCard className="flex flex-col justify-between">
          <div className="mb-6 flex items-center gap-4">
            <Image
              src={DEMO_USER.avatarUrl}
              alt={DEMO_USER.displayName}
              width={56}
              height={56}
              className="h-14 w-14 shrink-0 rounded-full object-cover"
            />
            <div>
              <h1 className="text-lg font-bold text-[#111827] sm:text-xl">
                Welcome back, {DEMO_USER.displayName} 👋
              </h1>
              <p className="mt-0.5 text-sm text-[#6B7280]">
                Here&apos;s a summary of your account.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <StatCard
              value={DEMO_USER.wishlistCount}
              label="Wishlist Items"
              iconClassName="text-[#DB2777]"
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
                </svg>
              }
            />
            <StatCard
              value={DEMO_USER.purchaseCount}
              label="Previous Purchases"
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              }
            />
            <StatCard
              value={DEMO_USER.roomsScannedCount}
              label="Rooms Scanned"
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M4 19V6a2 2 0 012-2h12a2 2 0 012 2v13" />
                  <path d="M4 19h16M8 11h8M8 15h5" />
                </svg>
              }
            />
          </div>
        </DashboardCard>

        {/* Right — scans of my home */}
        <DashboardCard>
          <SectionHeader title="Scans of My Home" href="/scans" />

          <div className="-mx-1 flex gap-3 overflow-x-auto pb-1">
            {DEMO_ROOM_SCANS.map((scan) => (
              <Link
                key={scan.id}
                href="/room-builder"
                className={`group w-[148px] shrink-0 overflow-hidden rounded-xl border bg-white transition ${
                  scan.selected
                    ? 'border-[#DB2777]/40 ring-2 ring-[#DB2777]/20'
                    : 'border-[#E5E7EB] hover:border-[#DB2777]/30'
                }`}
              >
                <div className="relative h-[100px] bg-[#F3F4F6]">
                  <Image
                    src={scan.imageUrl}
                    alt={scan.title}
                    fill
                    className="object-cover"
                    sizes="148px"
                  />
                  {scan.selected && (
                    <div className="absolute inset-0 bg-[#DB2777]/10" aria-hidden />
                  )}
                </div>
                <div className="px-2.5 py-2">
                  <p className="truncate text-sm font-semibold text-[#111827]">
                    {scan.title}
                  </p>
                  <p className="text-[11px] text-[#6B7280]">
                    Scanned on {scan.scannedOn}
                  </p>
                </div>
              </Link>
            ))}

            <Link
              href="/scans"
              className="flex w-[120px] shrink-0 flex-col items-center justify-center rounded-xl border border-[#E5E7EB] bg-white py-6 transition hover:border-[#DB2777]/40 hover:bg-[#FFF0F5]"
            >
              <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-[#F9A8D4] text-xl font-light text-[#DB2777]">
                +
              </span>
              <span className="px-2 text-center text-xs font-semibold text-[#374151]">
                Add New Scan
              </span>
            </Link>
          </div>
        </DashboardCard>
      </div>

      {/* Bottom — wishlist */}
      <DashboardCard>
        <SectionHeader title="Wishlist Items" href="/wishlist" />

        <div className="-mx-1 flex gap-4 overflow-x-auto pb-1">
          {DEMO_WISHLIST.map((item) => (
            <article
              key={item.sku}
              className="w-[160px] shrink-0 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white sm:w-[180px]"
            >
              <div className="relative aspect-square bg-[#F9FAFB] p-3">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-contain p-4"
                  sizes="180px"
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-[#DB2777]"
                  aria-label="Saved to wishlist"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
                  </svg>
                </button>
              </div>
              <div className="border-t border-[#F3F4F6] px-3 py-2.5">
                <p className="truncate text-sm font-semibold text-[#111827]">
                  {item.name}
                </p>
                <p className="mt-0.5 text-sm text-[#374151]">
                  ${item.price.toLocaleString()}
                </p>
              </div>
            </article>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
