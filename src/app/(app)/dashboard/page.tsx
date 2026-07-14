import Image from 'next/image';
import Link from 'next/link';
import ProductImage from '@/components/ui/ProductImage';
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
      className={`rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:rounded-xl sm:p-6 ${className}`}
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
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="font-serif text-lg font-bold text-[#111827] sm:text-[17px]">
        {title}
      </h2>
      <Link
        href={href}
        className="shrink-0 text-sm font-semibold text-[#DB2777] hover:text-[#BE185D]"
      >
        View all
      </Link>
    </div>
  );
}

function StatRow({
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
    <div className="flex w-full items-center gap-4 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3.5 sm:gap-3 lg:flex-1">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center sm:h-auto sm:w-auto ${iconClassName}`}>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-2xl font-bold leading-none text-[#111827] sm:text-xl">
          {value}
        </p>
        <p className="mt-1 text-sm text-[#6B7280] sm:text-xs">{label}</p>
      </div>
    </div>
  );
}

function HorizontalScroll({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {children}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      {/* Mobile: stacked cards. Desktop: welcome | scans side by side */}
      <div className="mb-5 grid grid-cols-1 gap-5 lg:mb-6 lg:grid-cols-2 lg:gap-6">
        {/* Profile summary */}
        <DashboardCard>
          <div className="mb-5 flex items-center gap-3 sm:mb-6 sm:gap-4">
            <Image
              src={DEMO_USER.avatarUrl}
              alt={DEMO_USER.displayName}
              width={56}
              height={56}
              className="h-12 w-12 shrink-0 rounded-full object-cover sm:h-14 sm:w-14"
            />
            <div className="min-w-0">
              <h1 className="text-base font-bold leading-snug text-[#111827] sm:text-xl">
                Welcome back, {DEMO_USER.displayName} 👋
              </h1>
              <p className="mt-0.5 text-sm text-[#6B7280]">
                Here&apos;s a summary of your account.
              </p>
            </div>
          </div>

          {/* Mobile: stacked rows. Desktop: 3 columns */}
          <div className="flex flex-col gap-3 lg:flex-row lg:gap-3">
            <StatRow
              value={DEMO_USER.wishlistCount}
              label="Wishlist Items"
              iconClassName="text-[#DB2777]"
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
                </svg>
              }
            />
            <StatRow
              value={DEMO_USER.purchaseCount}
              label="Previous Purchases"
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              }
            />
            <StatRow
              value={DEMO_USER.roomsScannedCount}
              label="Rooms Scanned"
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M4 19V6a2 2 0 012-2h12a2 2 0 012 2v13" />
                  <path d="M4 19h16M8 11h8M8 15h5" />
                </svg>
              }
            />
          </div>
        </DashboardCard>

        {/* Scans of my home */}
        <DashboardCard className="min-w-0">
          <SectionHeader title="Scans of My Home" href="/scans" />

          {/* Bleed scroll to card edges on mobile */}
          <HorizontalScroll className="-mx-1 sm:mx-0">
            {DEMO_ROOM_SCANS.map((scan) => (
              <Link
                key={scan.id}
                href={`/room-builder?scan=${scan.id}`}
                className={`w-[min(58vw,220px)] shrink-0 snap-start overflow-hidden rounded-xl border bg-white sm:w-[180px] lg:w-[148px] ${
                  scan.selected
                    ? 'border-[#DB2777]/40 ring-2 ring-[#DB2777]/20'
                    : 'border-[#E5E7EB]'
                }`}
              >
                <div className="relative h-[120px] bg-[#F3F4F6] sm:h-[100px]">
                  <Image
                    src={scan.imageUrl}
                    alt={scan.title}
                    fill
                    className="rounded-t-xl object-cover"
                    sizes="(max-width: 640px) 58vw, 180px"
                  />
                  {scan.selected && (
                    <div className="absolute inset-0 rounded-t-xl bg-[#DB2777]/10" aria-hidden />
                  )}
                </div>
                <div className="px-3 py-2.5">
                  <p className="truncate text-sm font-bold text-[#111827]">
                    {scan.title}
                  </p>
                  <p className="mt-0.5 text-xs text-[#6B7280]">
                    Scanned on {scan.scannedOn}
                  </p>
                </div>
              </Link>
            ))}

            <Link
              href="/scans"
              className="flex w-[min(42vw,160px)] shrink-0 snap-start flex-col items-center justify-center rounded-xl border border-[#E5E7EB] bg-white py-8 sm:w-[120px] sm:py-6"
            >
              <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-[#F9A8D4] text-2xl font-light text-[#DB2777] sm:h-9 sm:w-9 sm:text-xl">
                +
              </span>
              <span className="px-2 text-center text-xs font-semibold text-[#374151]">
                Add New Scan
              </span>
            </Link>
          </HorizontalScroll>
        </DashboardCard>
      </div>

      {/* Wishlist */}
      <DashboardCard>
        <SectionHeader title="Wishlist Items" href="/wishlist" />

        <HorizontalScroll className="-mx-1 sm:mx-0">
          {DEMO_WISHLIST.map((item) => (
            <article
              key={item.sku}
              className="w-[min(52vw,200px)] shrink-0 snap-start overflow-hidden rounded-xl border border-[#E5E7EB] bg-white sm:w-[180px]"
            >
              <div className="relative aspect-square bg-[#F9FAFB]">
                <ProductImage
                  src={item.imageUrl}
                  alt={item.name}
                  objectFit="contain"
                  className="p-4"
                  sizes="(max-width: 640px) 52vw, 180px"
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
        </HorizontalScroll>
      </DashboardCard>
    </div>
  );
}
