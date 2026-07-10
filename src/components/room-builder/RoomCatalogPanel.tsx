'use client';

import { useMemo, useState } from 'react';
import ProductImage from '@/components/ui/ProductImage';
import { ROOM_BUILDER_PRODUCTS } from '@/lib/demo/roomBuilder';
import type { PlacedItem } from '@/lib/demo/roomBuilder';
import { demoProductBySku } from '@/lib/demo/catalog';

interface RoomCatalogPanelProps {
  placedItems: PlacedItem[];
  onAdd: (sku: string) => void;
  onSelectPlaced: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function RoomCatalogPanel({
  placedItems,
  onAdd,
  onSelectPlaced,
  onRemove,
}: RoomCatalogPanelProps) {
  const [tab, setTab] = useState<'catalog' | 'my-items'>('catalog');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ROOM_BUILDER_PRODUCTS;
    return ROOM_BUILDER_PRODUCTS.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
    );
  }, [query]);

  const myItems = placedItems
    .map((item) => ({ item, product: demoProductBySku(item.sku) }))
    .filter((x) => x.product);

  return (
    <aside className="flex h-full w-full shrink-0 flex-col border-l border-[#E5E7EB] bg-white lg:w-[280px] xl:w-[300px]">
      <div className="flex border-b border-[#E5E7EB]">
        <button
          type="button"
          onClick={() => setTab('catalog')}
          className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
            tab === 'catalog'
              ? 'border-b-2 border-[#DB2777] text-[#DB2777]'
              : 'text-[#6B7280] hover:text-[#374151]'
          }`}
        >
          Catalog
        </button>
        <button
          type="button"
          onClick={() => setTab('my-items')}
          className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
            tab === 'my-items'
              ? 'border-b-2 border-[#DB2777] text-[#DB2777]'
              : 'text-[#6B7280] hover:text-[#374151]'
          }`}
        >
          My Items ({placedItems.length})
        </button>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden p-4">
        {tab === 'catalog' ? (
          <>
            <div className="relative mb-3">
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4-4" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search furniture, decor, styles…"
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#658EC2] focus:ring-1 focus:ring-[#658EC2]/30"
              />
            </div>

            <div className="mb-3 grid grid-cols-2 gap-2">
              {['Category', 'Style', 'Color'].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="rounded-lg border border-[#E5E7EB] bg-white px-2 py-2 text-left text-xs font-medium text-[#374151] hover:bg-[#F9FAFB]"
                >
                  {label} ▾
                </button>
              ))}
              <button
                type="button"
                className="col-span-2 flex items-center justify-center gap-1.5 rounded-lg border border-[#E5E7EB] py-2 text-xs font-medium text-[#374151] hover:bg-[#F9FAFB]"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h10M4 18h6" />
                </svg>
                Filters
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2.5">
                {filtered.map((product, i) => (
                  <button
                    key={product.sku}
                    type="button"
                    onClick={() => onAdd(product.sku)}
                    className="group overflow-hidden rounded-xl border border-[#E5E7EB] bg-white text-left transition-shadow hover:shadow-md"
                  >
                    <div className="relative aspect-square bg-[#F9FAFB] p-2">
                      <ProductImage src={product.image_url} alt={product.name} objectFit="contain" />
                      <span className="absolute right-1.5 top-1.5 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-[#6B7280] shadow-sm">
                        ···
                      </span>
                    </div>
                    <p className="truncate px-2 py-2 text-xs font-semibold text-[#111827]">
                      {product.name.split(' ').slice(0, 3).join(' ') || `Model ${i + 1}`}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 rounded-xl bg-[#FFF0F5] p-3 ring-1 ring-[#DB2777]/15">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#DB2777] text-white">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2h12v4H6zM4 8h16v12H4z" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-bold text-[#DB2777]">View in My Room</p>
                  <p className="text-[10px] text-[#BE185D]/80">AR preview on mobile</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {myItems.length === 0 ? (
              <p className="py-8 text-center text-sm text-[#9CA3AF]">
                Add items from the catalog to see them here.
              </p>
            ) : (
              <ul className="space-y-2">
                {myItems.map(({ item, product }) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-1 rounded-xl border border-[#E5E7EB] p-2 hover:bg-[#F9FAFB]"
                  >
                    <button
                      type="button"
                      onClick={() => onSelectPlaced(item.id)}
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    >
                      <div className="relative h-12 w-12 shrink-0 rounded-lg bg-[#F9FAFB] p-1">
                        <ProductImage src={product!.image_url} alt={product!.name} objectFit="contain" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-[#111827]">{product!.name}</p>
                        <p className="text-xs text-[#6B7280]">${product!.price.toLocaleString()}</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      className="shrink-0 rounded-lg p-2 text-[#9CA3AF] transition hover:bg-red-50 hover:text-red-600"
                      title="Remove from room"
                      aria-label={`Remove ${product!.name} from room`}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
