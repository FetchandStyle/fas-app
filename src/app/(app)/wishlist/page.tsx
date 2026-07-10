import Image from 'next/image';
import Link from 'next/link';
import { DEMO_USER, DEMO_WISHLIST } from '@/lib/demo/dashboard';

export default function WishlistPage() {
  const total = DEMO_WISHLIST.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#111827] sm:text-3xl">Wishlist</h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              {DEMO_USER.wishlistCount} items saved · ${total.toLocaleString()} shown below
            </p>
          </div>
          <Link
            href="/search"
            className="text-sm font-semibold text-[#DB2777] hover:text-[#BE185D]"
          >
            Find more items →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DEMO_WISHLIST.map((item) => (
            <article
              key={item.sku}
              className="group overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm transition hover:border-[#DB2777]/30 hover:shadow-md"
            >
              <div className="relative aspect-square bg-[#F9FAFB]">
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="25vw" />
                <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#DB2777] shadow-sm">
                  ♥
                </span>
              </div>
              <div className="border-t border-[#F3F4F6] p-4">
                <p className="line-clamp-2 font-semibold text-[#111827]">{item.name}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-lg font-bold text-[#111827]">
                    ${item.price.toLocaleString()}
                  </span>
                  <Link
                    href="/search"
                    className="rounded-lg bg-[#DB2777] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#BE185D]"
                  >
                    Shop
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
