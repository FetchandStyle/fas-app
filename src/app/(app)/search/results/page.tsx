'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ui/ProductCard';
import type { Product } from '@/types';

function ResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const hasImage = searchParams.get('image') === '1';

  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function runSearch() {
      setLoading(true);
      setError('');

      try {
        const formData = new FormData();
        if (query) formData.append('query', query);

        if (hasImage) {
          const stored = sessionStorage.getItem('searchImage');
          if (stored) {
            const res = await fetch(stored);
            const blob = await res.blob();
            formData.append('image', blob);
          } else {
            formData.append('query', 'dining table');
          }
        }

        if (!query && !hasImage) {
          formData.append('query', '');
        }

        formData.append('limit', '50');

        const response = await fetch('/api/search', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Search failed');

        const data = await response.json();
        setResults(data.results ?? []);
      } catch {
        setError('Could not load results. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    runSearch();
  }, [query, hasImage]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <SearchBar initialQuery={query} variant="compact" />
      </div>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-brand-blue-gray">
            {hasImage ? 'Image search results' : query ? `Results for “${query}”` : 'All products'}
          </h1>
          {!loading && (
            <p className="mt-1 text-sm text-brand-muted">
              {results.length} product{results.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
        <Link
          href="/score"
          className="text-sm font-semibold text-brand-blue hover:underline"
        >
          View AI Commerce Score →
        </Link>
      </div>

      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/5] animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-brand-muted">
          No products matched. Try “round dining table”.
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((product, index) => (
            <ProductCard
              key={product.sku}
              product={product}
              matchPercent={
                product.score != null
                  ? Math.round(product.score * 100)
                  : Math.max(60, 98 - index * 3)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-6 py-20 text-center text-brand-muted">
          Loading results…
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
