import Link from 'next/link';
import ProductImage from '@/components/ui/ProductImage';
import { DEMO_PURCHASES, DEMO_USER } from '@/lib/demo/dashboard';

function statusClass(status: string) {
  if (status === 'Delivered') return 'bg-emerald-50 text-emerald-700';
  if (status === 'Shipped') return 'bg-blue-50 text-blue-700';
  return 'bg-amber-50 text-amber-700';
}

export default function PurchasesPage() {
  const grandTotal = DEMO_PURCHASES.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="font-serif text-2xl font-bold text-[#111827] sm:text-3xl">
            Previous Purchases
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            {DEMO_USER.purchaseCount} orders on file · ${grandTotal.toLocaleString()} lifetime spend
          </p>
        </div>

        <div className="space-y-4">
          {DEMO_PURCHASES.map((order) => (
            <article
              key={order.id}
              className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F3F4F6] px-5 py-4">
                <div>
                  <p className="text-sm font-bold text-[#111827]">Order {order.id}</p>
                  <p className="text-sm text-[#6B7280]">{order.orderDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(order.status)}`}
                  >
                    {order.status}
                  </span>
                  <span className="text-lg font-bold text-[#111827]">
                    ${order.total.toLocaleString()}
                  </span>
                </div>
              </div>

              <ul className="divide-y divide-[#F3F4F6]">
                {order.items.map((item) => (
                  <li key={`${order.id}-${item.sku}`} className="flex items-center gap-4 px-5 py-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F9FAFB] p-1">
                      <ProductImage src={item.imageUrl} alt={item.name} objectFit="contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/product/${item.sku}`}
                        className="line-clamp-2 font-semibold text-[#111827] hover:text-[#DB2777]"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-0.5 text-sm text-[#6B7280]">
                        Qty {item.quantity} · ${item.price.toLocaleString()} each
                      </p>
                    </div>
                    <span className="shrink-0 font-bold text-[#111827]">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
