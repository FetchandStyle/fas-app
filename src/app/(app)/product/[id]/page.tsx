'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import type { Product } from '@/types';
import { HERO_PRODUCT_SKU } from '@/lib/demo/config';

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/product/${id}`);
        if (!res.ok) throw new Error('Not found');
        setProduct(await res.json());
      } catch {
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-slate-200" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="mb-4 text-brand-muted">{error || 'Product not found.'}</p>
        <Button href="/search">Back to search</Button>
      </div>
    );
  }

  const isHero = product.sku === HERO_PRODUCT_SKU;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <Link
        href="/search/results?q=round%20dining%20table"
        className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-brand-blue hover:underline"
      >
        ← Back to results
      </Link>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-muted">
            {product.source}
          </p>
          <h1 className="mb-4 font-serif text-3xl text-brand-blue-gray lg:text-4xl">
            {product.name}
          </h1>
          <p className="mb-6 text-3xl font-bold text-slate-900">
            ${product.price.toLocaleString()}
          </p>
          <p className="mb-8 leading-relaxed text-brand-muted">
            {product.description}
          </p>

          <dl className="mb-8 grid grid-cols-3 gap-4 rounded-xl border border-slate-200 bg-white p-5">
            <div>
              <dt className="text-xs font-medium uppercase text-brand-muted">Length</dt>
              <dd className="text-lg font-semibold">{product.length}&quot;</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-brand-muted">Width</dt>
              <dd className="text-lg font-semibold">{product.width}&quot;</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-brand-muted">Height</dt>
              <dd className="text-lg font-semibold">{product.height}&quot;</dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-3">
            {isHero && (
              <Button href="/score" variant="secondary">
                View enrichment &amp; AI score
              </Button>
            )}
            <Button href="/search" variant="outline">
              Search more products
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
