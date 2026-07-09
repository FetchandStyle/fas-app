import Image from 'next/image';
import { DEMO_WISHLIST } from '@/lib/demo/dashboard';

export default function WishlistPage() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-6 font-serif text-2xl text-gray-900">Wishlist</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DEMO_WISHLIST.map((item) => (
          <article key={item.sku} className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="relative aspect-square">
              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
            </div>
            <div className="p-3">
              <p className="font-medium">{item.name}</p>
              <p className="font-bold">${item.price.toLocaleString()}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
