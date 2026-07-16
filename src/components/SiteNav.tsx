'use client';

import AppImage from '@/components/ui/AppImage';
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

type NavLink = {
  href: string;
  label: string;
  external?: boolean;
};

const MID_LINKS: NavLink[] = [
  { href: FAS_HOW_IT_WORKS_URL, label: 'How it Works', external: true },
  { href: FAS_PRICING_URL, label: 'Pricing', external: true },
  { href: '/score', label: 'AI Readiness Score' },
  { href: FAS_FAQ_URL, label: 'FAQ', external: true },
  { href: FAS_CONTACT_URL, label: 'Contact Us', external: true },
];

export interface SiteNavProps {
  showNewSearchLink?: boolean;
}

export default function SiteNav({ showNewSearchLink }: SiteNavProps) {
  const pathname = usePathname();
  const isSearchFlow =
    pathname.startsWith('/search/results') || pathname.startsWith('/product/');
  const showNewSearch = showNewSearchLink ?? isSearchFlow;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative z-50 w-full bg-white px-4 py-3 shadow-sm sm:px-6 md:py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="shrink-0">
          <a
            href={FAS_MARKETING_HOME_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <AppImage
              src="/faslogo.png"
              alt="Fetch & Style — home"
              width={140}
              height={50}
              className="object-contain sm:h-[60px] sm:w-[150px]"
              priority
            />
          </a>
        </div>

        <div className="hidden flex-1 justify-center text-[#717182] md:flex">
          <ul className="flex flex-row gap-6 text-sm font-medium lg:gap-10 lg:text-base">
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
        </div>

        <div className="hidden items-center space-x-4 md:flex lg:space-x-6">
          {showNewSearch && (
            <Link
              href="/search"
              className="text-sm font-medium text-[#658EC2] hover:text-[#4a6fa3] lg:text-base"
            >
              New search
            </Link>
          )}
          <Link
            href="/search"
            className="text-sm font-medium text-[#3D3D3D] hover:text-gray-500 lg:text-base"
          >
            Try Demo
          </Link>
          <a
            href={FAS_CONTACT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 lg:px-6 lg:text-base"
          >
            Contact Us
          </a>
        </div>

        <button
          type="button"
          className="text-2xl text-gray-700 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="mt-3 space-y-2 rounded-lg bg-white p-4 font-medium text-gray-700 shadow-lg md:hidden">
          {MID_LINKS.map(({ href, label, external }) =>
            external ? (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="block py-2 hover:text-[#658EC2]"
              >
                {label}
              </a>
            ) : (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className="block py-2 hover:text-[#658EC2]"
              >
                {label}
              </Link>
            ),
          )}
          {showNewSearch && (
            <Link
              href="/search"
              onClick={() => setIsOpen(false)}
              className="block py-2 font-medium text-[#658EC2] hover:text-[#4a6fa3]"
            >
              New search
            </Link>
          )}
          <Link
            href="/search"
            onClick={() => setIsOpen(false)}
            className="block py-2 font-semibold text-[#658EC2] hover:text-gray-500"
          >
            Try Demo
          </Link>
          <a
            href={FAS_CONTACT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="block rounded-md bg-pink-600 px-4 py-2 text-center text-white hover:bg-pink-700"
          >
            Contact Us
          </a>
        </div>
      )}
    </nav>
  );
}
