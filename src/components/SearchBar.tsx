'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useRef, useState } from 'react';

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

  const isHero = variant === 'hero';

  function handleFile(file: File | undefined) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      sessionStorage.setItem('searchImage', dataUrl);
      setQuery('');
    };
    reader.readAsDataURL(file);
  }

  function clearImage() {
    setPreview(null);
    sessionStorage.removeItem('searchImage');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!query.trim() && !preview) return;

    setLoading(true);
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
    ? 'h-12 w-full rounded-xl border-2 border-brand-blue bg-white pl-11 pr-24 text-base text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30'
    : 'h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-20 text-sm text-slate-700 shadow-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue';

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-blue">
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
          disabled={!!preview}
          className={inputClass}
          aria-label="Search query"
        />

        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {preview ? (
            <button
              type="button"
              onClick={clearImage}
              className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
            >
              Clear image
            </button>
          ) : (
            <label className="cursor-pointer rounded-md p-2 text-brand-blue hover:bg-slate-100">
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
            className="rounded-lg bg-brand-pink px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-700 disabled:opacity-50"
          >
            {loading ? '…' : 'Search'}
          </button>
        </div>
      </div>

      {preview && (
        <div className="mt-3 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Uploaded search image"
            className="h-16 w-16 rounded-lg border border-slate-200 object-cover"
          />
          <p className="text-sm text-brand-muted">
            Image search — demo returns curated matches (Magnus table first).
          </p>
        </div>
      )}
    </form>
  );
}
