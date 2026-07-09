import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  /** 0–100 match percentage shown on the card */
  matchPercent?: number;
}

export default function ProductCard({ product, matchPercent }: ProductCardProps) {
  const pct =
    matchPercent ??
    (product.score != null ? Math.round(product.score * 100) : undefined);

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[4/3] bg-slate-100">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {pct != null && (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white shadow">
            {pct}% Match
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-brand-muted">
          {product.source}
        </p>
        <Link
          href={`/product/${product.sku}`}
          className="line-clamp-2 font-serif text-lg text-brand-blue-gray transition hover:text-brand-orange"
        >
          {product.name}
        </Link>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900">
            ${product.price.toLocaleString()}
          </span>
          <Link
            href={`/product/${product.sku}`}
            className="rounded-lg bg-brand-orange px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
