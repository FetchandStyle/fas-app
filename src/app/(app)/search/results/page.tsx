'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ui/ProductCard';
import DashboardCard from '@/components/ui/DashboardCard';
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

  const title = hasImage
    ? 'Image search results'
    : query
      ? `Results for “${query}”`
      : 'All products';

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <DashboardCard className="mb-6">
        <SearchBar initialQuery={query} variant="compact" />
      </DashboardCard>

      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#111827] sm:text-2xl">{title}</h1>
          {!loading && (
            <p className="mt-1 text-sm text-[#6B7280]">
              {results.length} product{results.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
        <Link
          href="/score"
          className="text-sm font-semibold text-[#DB2777] hover:text-[#BE185D]"
        >
          View AI Commerce Score →
        </Link>
      </div>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/5] animate-pulse rounded-xl border border-[#E5E7EB] bg-white"
            />
          ))}
        </div>
      )}

      {error && (
        <DashboardCard>
          <p className="text-sm text-red-600">{error}</p>
        </DashboardCard>
      )}

      {!loading && !error && results.length === 0 && (
        <DashboardCard className="text-center">
          <p className="text-[#6B7280]">No products matched. Try “round dining table”.</p>
        </DashboardCard>
      )}

      {!loading && results.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        <div className="px-6 py-20 text-center text-[#6B7280]">Loading results…</div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
