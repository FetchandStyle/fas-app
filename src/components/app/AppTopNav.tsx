'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  FAS_CONTACT_URL,
  FAS_FAQ_URL,
  FAS_HOW_IT_WORKS_URL,
  FAS_MARKETING_HOME_URL,
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

export default function AppTopNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const showNewSearch =
    pathname.startsWith('/search') || pathname.startsWith('/product');

  return (
    <header className="app-top-nav sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-white shadow-sm">
      <div className="flex h-[72px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/dashboard" className="shrink-0">
          <Image
            src="/faslogo.png"
            alt="Fetch & Style"
            width={140}
            height={50}
            className="h-11 w-auto object-contain sm:h-12"
            priority
          />
        </Link>

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

        <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
          {showNewSearch && (
            <Link
              href="/search"
              className="hidden text-[15px] font-medium text-[#658EC2] hover:text-[#4a6fa3] md:inline"
            >
              New search
            </Link>
          )}
          <Link
            href="/search"
            className="hidden text-[15px] font-medium text-[#1F2937] hover:text-gray-500 sm:inline"
          >
            Try Demo
          </Link>
          <a
            href={FAS_CONTACT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-md bg-[#DB2777] px-5 py-2.5 text-[15px] font-semibold text-white hover:bg-[#BE185D] sm:inline"
          >
            Contact Us
          </a>

          <Link
            href="/wishlist"
            className="relative rounded-full p-2 text-[#658EC2] hover:bg-pink-50"
            aria-label="Wishlist"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
            </svg>
            {DEMO_USER.wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-600 px-1 text-[10px] font-bold text-white">
                {DEMO_USER.wishlistCount > 99 ? '99+' : DEMO_USER.wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            className="relative rounded-full p-2 text-[#658EC2] hover:bg-pink-50"
            aria-label="Cart"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <path d="M3 6h18M16 10a4 4 0 01-8 0" />
            </svg>
          </Link>

          <div className="relative">
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

          <button
            type="button"
            className="rounded-lg p-2 text-gray-600 xl:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 xl:hidden">
          <ul className="space-y-2 text-sm font-medium text-[#717182]">
            {MID_LINKS.map(({ href, label, external }) => (
              <li key={href}>
                {external ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="block py-2">
                    {label}
                  </a>
                ) : (
                  <Link href={href} className="block py-2" onClick={() => setMenuOpen(false)}>
                    {label}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <Link href="/search" className="block py-2 text-[#658EC2]">
                Try Demo
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
