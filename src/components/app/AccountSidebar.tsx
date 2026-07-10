'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FAS_CONTACT_URL,
  FAS_FAQ_URL,
  FAS_HOW_IT_WORKS_URL,
  FAS_PRICING_URL,
} from '@/lib/brand';

const MOBILE_MARKETING_LINKS = [
  { href: FAS_HOW_IT_WORKS_URL, label: 'How it Works' },
  { href: FAS_PRICING_URL, label: 'Pricing' },
  { href: '/score', label: 'AI Readiness Score' },
  { href: FAS_FAQ_URL, label: 'FAQ' },
  { href: FAS_CONTACT_URL, label: 'Contact Us' },
];

type SidebarItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const ICON_SIZE = 22;
const STROKE = 1.5;

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center">
      {children}
    </span>
  );
}

const PRIMARY_ITEMS: SidebarItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <Icon>
        <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE}>
          <path d="M3 10.5L12 4l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" />
        </svg>
      </Icon>
    ),
  },
  {
    href: '/scans',
    label: 'Scans of My Home',
    icon: (
      <Icon>
        <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE}>
          <path d="M4 7h16a1 1 0 011 1v11a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z" />
          <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
          <circle cx="12" cy="13" r="3" />
        </svg>
      </Icon>
    ),
  },
  {
    href: '/wishlist',
    label: 'Wishlist',
    icon: (
      <Icon>
        <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE}>
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
        </svg>
      </Icon>
    ),
  },
  {
    href: '/purchases',
    label: 'Previous Purchases',
    icon: (
      <Icon>
        <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE}>
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      </Icon>
    ),
  },
  {
    href: '/profile',
    label: 'My Profile & KYC',
    icon: (
      <Icon>
        <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
        </svg>
      </Icon>
    ),
  },
];

const SECONDARY_ITEMS: SidebarItem[] = [
  {
    href: '/room-builder',
    label: 'Room Builder',
    icon: (
      <Icon>
        <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE}>
          <path d="M12 2l8 4.5v7L12 18l-8-4.5v-7L12 2z" />
          <path d="M12 11.5V18" />
          <path d="M12 11.5L4 7" />
          <path d="M12 11.5l8-4.5" />
        </svg>
      </Icon>
    ),
  },
  {
    href: '/design-history',
    label: 'Design History',
    icon: (
      <Icon>
        <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE}>
          <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M12 7v5l3 2" />
        </svg>
      </Icon>
    ),
  },
  {
    href: '/saved-rooms',
    label: 'Saved Rooms',
    icon: (
      <Icon>
        <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE}>
          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
        </svg>
      </Icon>
    ),
  },
  {
    href: '/addresses',
    label: 'My Addresses',
    icon: (
      <Icon>
        <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE}>
          <path d="M12 21s-6-4.35-6-10a6 6 0 1112 0c0 5.65-6 10-6 10z" />
          <circle cx="12" cy="11" r="2.5" />
        </svg>
      </Icon>
    ),
  },
  {
    href: '/payment',
    label: 'Payment Methods',
    icon: (
      <Icon>
        <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
        </svg>
      </Icon>
    ),
  },
  {
    href: '/settings',
    label: 'Account Settings',
    icon: (
      <Icon>
        <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      </Icon>
    ),
  },
  {
    href: '/help',
    label: 'Help & Support',
    icon: (
      <Icon>
        <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 2-3 4" />
          <path d="M12 17h.01" />
        </svg>
      </Icon>
    ),
  },
];

function SidebarLink({
  item,
  active,
  onNavigate,
}: {
  item: SidebarItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-[15px] leading-none transition-colors ${
        active
          ? 'bg-[#FFF0F5] font-semibold text-[#C2185B]'
          : 'font-medium text-[#1F2937] hover:bg-gray-50'
      }`}
    >
      <span className={active ? 'text-[#DB2777]' : 'text-[#374151]'}>{item.icon}</span>
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function SidebarDivider() {
  return <div className="my-3 border-t border-[#E5E7EB]" />;
}

function SidebarNav({
  isActive,
  onNavigate,
  hideTitle = false,
  showMarketingLinks = false,
}: {
  isActive: (href: string) => boolean;
  onNavigate?: () => void;
  hideTitle?: boolean;
  showMarketingLinks?: boolean;
}) {
  return (
    <>
      {!hideTitle && (
        <h2 className="mb-6 px-1 text-[17px] font-bold tracking-tight text-[#111827]">
          My Account
        </h2>
      )}

      <nav className="flex flex-1 flex-col gap-0.5">
        {PRIMARY_ITEMS.map((item) => (
          <SidebarLink
            key={item.href}
            item={item}
            active={isActive(item.href)}
            onNavigate={onNavigate}
          />
        ))}

        <SidebarDivider />

        {SECONDARY_ITEMS.map((item) => (
          <SidebarLink
            key={item.href}
            item={item}
            active={isActive(item.href)}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {showMarketingLinks && (
        <>
          <SidebarDivider />
          <p className="mb-1 px-4 text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
            Company
          </p>
          {MOBILE_MARKETING_LINKS.map(({ href, label }) =>
            href.startsWith('/') ? (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                className="block rounded-lg px-4 py-2.5 text-[14px] font-medium text-[#374151] hover:bg-gray-50"
              >
                {label}
              </Link>
            ) : (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onNavigate}
                className="block rounded-lg px-4 py-2.5 text-[14px] font-medium text-[#374151] hover:bg-gray-50"
              >
                {label}
              </a>
            ),
          )}
        </>
      )}

      <SidebarDivider />

      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-lg px-4 py-3 text-[15px] font-medium text-[#374151] transition-colors hover:bg-gray-50"
      >
        <Icon>
          <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={STROKE}>
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h2" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
        </Icon>
        Sign Out
      </Link>
    </>
  );
}

interface AccountSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  desktopCollapsed?: boolean;
  onDesktopToggle?: () => void;
  showDesktopToggle?: boolean;
}

export default function AccountSidebar({
  mobileOpen = false,
  onMobileClose,
  desktopCollapsed = false,
  onDesktopToggle,
  showDesktopToggle = false,
}: AccountSidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      {/* Desktop sidebar — slide collapse on room builder */}
      <aside
        className={`account-sidebar hidden shrink-0 overflow-hidden border-r border-[#E5E7EB] bg-white transition-[width] duration-300 ease-in-out lg:block ${
          desktopCollapsed ? 'w-0 border-r-0' : 'w-[260px]'
        }`}
      >
        <div className="flex h-[calc(100vh-72px)] w-[260px] flex-col px-5 py-8">
          <SidebarNav isActive={isActive} />
        </div>
      </aside>

      {showDesktopToggle && onDesktopToggle && (
        <button
          type="button"
          onClick={onDesktopToggle}
          className={`absolute top-1/2 z-30 hidden -translate-y-1/2 items-center rounded-r-lg border border-l-0 border-[#E5E7EB] bg-white px-1.5 py-4 text-[#6B7280] shadow-md transition-all duration-300 hover:bg-[#F9FAFB] hover:text-[#DB2777] lg:flex ${
            desktopCollapsed ? 'left-0' : 'left-[260px]'
          }`}
          aria-label={desktopCollapsed ? 'Show account menu' : 'Hide account menu'}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`transition-transform ${desktopCollapsed ? '' : 'rotate-180'}`}
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            aria-label="Close account menu"
            onClick={onMobileClose}
          />
          <aside className="account-sidebar fixed inset-y-0 left-0 z-50 flex w-[min(300px,85vw)] flex-col bg-white shadow-xl lg:hidden">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
              <span className="text-[17px] font-bold text-[#111827]">My Account</span>
              <button
                type="button"
                onClick={onMobileClose}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close menu"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto px-5 py-6">
              <SidebarNav
                isActive={isActive}
                onNavigate={onMobileClose}
                hideTitle
                showMarketingLinks
              />
            </div>
          </aside>
        </>
      )}
    </>
  );
}
