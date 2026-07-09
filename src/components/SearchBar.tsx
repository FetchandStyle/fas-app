'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useRef, useState } from 'react';
import { compressImageForSearch, searchImageErrorMessage } from '@/lib/imageSearch';

interface SearchBarProps {
  initialQuery?: string;
  variant?: 'hero' | 'compact';
}

export default function SearchBar({
  initialQuery = '',
  variant = 'compact',
}: SearchBarProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isHero = variant === 'hero';

  async function handleFile(file: File | undefined) {
    if (!file || !file.type.startsWith('image/')) return;
    setError('');
    setLoading(true);
    try {
      const dataUrl = await compressImageForSearch(file);
      setPreview(dataUrl);
      sessionStorage.setItem('searchImage', dataUrl);
      setQuery('');
    } catch (err) {
      setError(searchImageErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function clearImage() {
    setPreview(null);
    sessionStorage.removeItem('searchImage');
    setError('');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!query.trim() && !preview) return;

    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (preview) params.set('image', '1');
      router.push(`/search/results?${params.toString()}`);
    } finally {
      setLoading(false);
    }
  }

  const inputClass = isHero
    ? 'h-12 w-full rounded-xl border border-[#E5E7EB] bg-white pl-11 pr-28 text-[15px] text-[#374151] shadow-sm focus:border-[#658EC2] focus:outline-none focus:ring-2 focus:ring-[#658EC2]/20'
    : 'h-11 w-full rounded-lg border border-[#E5E7EB] bg-white pl-10 pr-24 text-sm text-[#374151] shadow-sm focus:border-[#658EC2] focus:outline-none focus:ring-1 focus:ring-[#658EC2]';

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#658EC2]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3-3" />
          </svg>
        </span>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            isHero
              ? 'Try “round dining table” or upload a room photo'
              : 'Refine your search'
          }
          disabled={!!preview || loading}
          className={inputClass}
          aria-label="Search query"
        />

        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {preview ? (
            <button
              type="button"
              onClick={clearImage}
              className="rounded-md px-2 py-1 text-xs font-medium text-[#6B7280] hover:bg-gray-100"
            >
              Clear
            </button>
          ) : (
            <label className={`cursor-pointer rounded-md p-2 text-[#658EC2] hover:bg-gray-100 ${loading ? 'pointer-events-none opacity-50' : ''}`}>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <circle cx="8.5" cy="10.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </label>
          )}

          <button
            type="submit"
            disabled={loading || (!query.trim() && !preview)}
            className="rounded-lg bg-[#DB2777] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#BE185D] disabled:opacity-50"
          >
            {loading ? '…' : 'Search'}
          </button>
        </div>
      </div>

      {preview && (
        <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#E5E7EB] bg-white p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Uploaded search image"
            className="h-14 w-14 rounded-lg border border-[#E5E7EB] object-cover"
          />
          <p className="text-sm text-[#6B7280]">
            Image search ready — demo returns Magnus table first.
          </p>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
