import Link from 'next/link';
import ProductImage from '@/components/ui/ProductImage';
import { DEMO_CART } from '@/lib/demo/dashboard';

export default function CartPage() {
  const subtotal = DEMO_CART.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 49;
  const total = subtotal + shipping;

  return (
    <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#111827] sm:text-3xl">Cart</h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              {DEMO_CART.length} items from your Room Builder session
            </p>
          </div>
          <Link
            href="/search"
            className="text-sm font-semibold text-[#658EC2] hover:text-[#4a6fa3]"
          >
            Continue shopping →
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
            <ul className="divide-y divide-[#F3F4F6]">
              {DEMO_CART.map((item) => (
                <li key={item.sku} className="flex items-center gap-4 p-5">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F9FAFB] p-2">
                    <ProductImage src={item.imageUrl} alt={item.name} objectFit="contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                      {item.source}
                    </p>
                    <Link
                      href={`/product/${item.sku}`}
                      className="line-clamp-2 font-semibold text-[#111827] hover:text-[#DB2777]"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm text-[#6B7280]">Qty {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#111827]">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-[#9CA3AF]">${item.price.toLocaleString()} each</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <aside className="h-fit rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-serif text-lg font-bold text-[#111827]">Order Summary</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-[#6B7280]">Subtotal</dt>
                <dd className="font-semibold text-[#111827]">${subtotal.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#6B7280]">Shipping</dt>
                <dd className="font-semibold text-[#111827]">
                  {shipping === 0 ? 'Free' : `$${shipping}`}
                </dd>
              </div>
              <div className="flex justify-between border-t border-[#F3F4F6] pt-3 text-base">
                <dt className="font-bold text-[#111827]">Total</dt>
                <dd className="font-bold text-[#DB2777]">${total.toLocaleString()}</dd>
              </div>
            </dl>
            <button
              type="button"
              className="mt-5 w-full rounded-xl bg-[#DB2777] px-4 py-3 text-sm font-semibold text-white hover:bg-[#BE185D]"
            >
              Checkout (Demo)
            </button>
            <Link
              href="/room-builder"
              className="mt-3 block text-center text-sm font-semibold text-[#658EC2] hover:text-[#4a6fa3]"
            >
              Back to Room Builder
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
