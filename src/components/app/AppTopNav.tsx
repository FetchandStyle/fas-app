'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  FAS_CONTACT_URL,
  FAS_FAQ_URL,
  FAS_HOW_IT_WORKS_URL,
  FAS_PRICING_URL,
} from '@/lib/brand';
import { DEMO_USER } from '@/lib/demo/dashboard';

const MID_LINKS = [
  { href: FAS_HOW_IT_WORKS_URL, label: 'How it Works', external: true },
  { href: FAS_PRICING_URL, label: 'Pricing', external: true },
  { href: '/score', label: 'AI Readiness Score', external: false },
  { href: FAS_FAQ_URL, label: 'FAQ', external: true },
  { href: FAS_CONTACT_URL, label: 'Contact Us', external: true },
];

export default function AppTopNav({
  onMenuClick,
  showMenuButton = false,
}: {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="app-top-nav sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-white shadow-sm">
      <div className="flex h-16 items-center gap-2 px-4 sm:h-[72px] sm:gap-3 sm:px-6">
        {/* Left: account menu + desktop logo */}
        <div className="flex shrink-0 items-center gap-2">
          {showMenuButton && (
            <button
              type="button"
              onClick={onMenuClick}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
              aria-label="Open account menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          )}
          <Link
            href="/dashboard"
            className={`shrink-0 ${showMenuButton ? 'hidden lg:block' : 'block'}`}
          >
            <Image
              src="/faslogo.png"
              alt="Fetch & Style"
              width={140}
              height={50}
              className="h-10 w-auto object-contain sm:h-12"
              priority
            />
          </Link>
        </div>

        {/* Mobile: centered logo */}
        {showMenuButton && (
          <div className="flex min-w-0 flex-1 justify-center lg:hidden">
            <Link href="/dashboard" className="shrink-0">
              <Image
                src="/faslogo.png"
                alt="Fetch & Style"
                width={120}
                height={44}
                className="h-9 w-auto object-contain sm:h-10"
                priority
              />
            </Link>
          </div>
        )}

        {/* Desktop: marketing nav */}
        <nav className="hidden flex-1 justify-center xl:flex">
          <ul className="flex items-center gap-8 text-[15px] font-medium text-[#374151]">
            {MID_LINKS.map(({ href, label, external }) => (
              <li key={href}>
                {external ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#658EC2]"
                  >
                    {label}
                  </a>
                ) : (
                  <Link href={href} className="hover:text-[#658EC2]">
                    {label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5 lg:gap-4">
          <Link
            href="/search"
            className="rounded-full p-2 text-[#658EC2] transition-colors hover:bg-[#F0F4F8] lg:hidden"
            aria-label="Search"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
          </Link>

          <Link
            href="/search"
            className="hidden items-center gap-2 rounded-md bg-[#658EC2] px-4 py-2 text-[15px] font-semibold text-white transition-colors hover:bg-[#4a6fa3] lg:inline-flex"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
            Search
          </Link>

          <Link
            href="/wishlist"
            className="group relative rounded-full p-2 transition-colors hover:bg-[#FFF0F5]"
            aria-label={`Wishlist, ${DEMO_USER.wishlistCount} items`}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              className="text-[#DB2777] transition-transform group-active:scale-95 lg:text-[#658EC2] lg:group-hover:text-[#DB2777]"
              fill="currentColor"
              stroke="none"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
            </svg>
            {DEMO_USER.wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#DB2777] px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                {DEMO_USER.wishlistCount > 99 ? '99+' : DEMO_USER.wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            className="rounded-full p-2 text-[#658EC2] transition-colors hover:bg-[#F0F4F8]"
            aria-label="Cart"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <path d="M3 6h18M16 10a4 4 0 01-8 0" />
            </svg>
          </Link>

          <Link
            href="/profile"
            className="rounded-full p-0.5 hover:bg-gray-50 lg:hidden"
            aria-label="My profile"
          >
            <Image
              src={DEMO_USER.avatarUrl}
              alt={DEMO_USER.displayName}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-pink-100"
            />
          </Link>

          <div className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-gray-50"
              aria-expanded={profileOpen}
            >
              <Image
                src={DEMO_USER.avatarUrl}
                alt={DEMO_USER.displayName}
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-pink-100"
              />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#717182" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {profileOpen && (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-40"
                  aria-label="Close menu"
                  onClick={() => setProfileOpen(false)}
                />
                <div className="absolute right-0 z-50 mt-2 w-52 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">{DEMO_USER.displayName}</p>
                    <p className="truncate text-xs text-gray-500">{DEMO_USER.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    My Profile &amp; KYC
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    Account Settings
                  </Link>
                  <Link
                    href="/"
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    Sign Out
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
