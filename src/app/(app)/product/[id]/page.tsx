'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductImage from '@/components/ui/ProductImage';
import DashboardCard from '@/components/ui/DashboardCard';
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
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <DashboardCard>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-xl bg-[#F3F4F6]" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 animate-pulse rounded bg-[#F3F4F6]" />
              <div className="h-4 w-full animate-pulse rounded bg-[#F3F4F6]" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-[#F3F4F6]" />
            </div>
          </div>
        </DashboardCard>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <DashboardCard className="text-center">
          <p className="mb-4 text-[#6B7280]">{error || 'Product not found.'}</p>
          <Link
            href="/search"
            className="inline-flex rounded-lg bg-[#DB2777] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#BE185D]"
          >
            Back to search
          </Link>
        </DashboardCard>
      </div>
    );
  }

  const isHero = product.sku === HERO_PRODUCT_SKU;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <Link
        href="/search/results?q=round%20dining%20table"
        className="mb-5 inline-flex items-center gap-1 text-sm font-semibold text-[#658EC2] hover:text-[#4a6fa3]"
      >
        ← Back to results
      </Link>

      <DashboardCard>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-square overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#F9FAFB]">
            <ProductImage
              src={product.image_url}
              alt={product.name}
              priority
              objectFit="contain"
              className="p-6"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
              {product.source}
            </p>
            <h1 className="mb-4 text-2xl font-bold text-[#111827] lg:text-3xl">
              {product.name}
            </h1>
            <p className="mb-6 text-3xl font-bold text-[#111827]">
              ${product.price.toLocaleString()}
            </p>
            <p className="mb-8 text-[15px] leading-relaxed text-[#6B7280]">
              {product.description}
            </p>

            <dl className="mb-8 grid grid-cols-3 gap-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
              <div>
                <dt className="text-xs font-semibold uppercase text-[#6B7280]">Length</dt>
                <dd className="text-lg font-bold text-[#111827]">{product.length}&quot;</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-[#6B7280]">Width</dt>
                <dd className="text-lg font-bold text-[#111827]">{product.width}&quot;</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-[#6B7280]">Height</dt>
                <dd className="text-lg font-bold text-[#111827]">{product.height}&quot;</dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-3">
              {isHero && (
                <Link
                  href="/score"
                  className="inline-flex rounded-lg bg-[#658EC2] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#557bb0]"
                >
                  View enrichment &amp; AI score
                </Link>
              )}
              <Link
                href="/search"
                className="inline-flex rounded-lg border border-[#658EC2] px-5 py-2.5 text-sm font-semibold text-[#658EC2] hover:bg-[#658EC2]/5"
              >
                Search more products
              </Link>
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
