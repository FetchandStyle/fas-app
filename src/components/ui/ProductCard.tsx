import Link from 'next/link';
import ProductImage from '@/components/ui/ProductImage';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  matchPercent?: number;
}

export default function ProductCard({ product, matchPercent }: ProductCardProps) {
  const pct =
    matchPercent ??
    (product.score != null ? Math.round(product.score * 100) : undefined);

  return (
    <article className="group overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm transition hover:border-[#DB2777]/30 hover:shadow-md">
      <div className="relative aspect-[4/3] bg-[#F9FAFB]">
        <ProductImage
          src={product.image_url}
          alt={product.name}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          objectFit="contain"
          className="p-3 transition duration-300 group-hover:scale-[1.02]"
        />
        {pct != null && (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            {pct}% Match
          </span>
        )}
      </div>

      <div className="border-t border-[#F3F4F6] p-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
          {product.source}
        </p>
        <Link
          href={`/product/${product.sku}`}
          className="line-clamp-2 text-[15px] font-semibold leading-snug text-[#111827] transition hover:text-[#DB2777]"
        >
          {product.name}
        </Link>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-[#111827]">
            ${product.price.toLocaleString()}
          </span>
          <Link
            href={`/product/${product.sku}`}
            className="rounded-lg bg-[#DB2777] px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-[#BE185D]"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
