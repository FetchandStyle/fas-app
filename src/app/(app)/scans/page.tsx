import Image from 'next/image';
import Link from 'next/link';
import { DEMO_ROOM_SCANS, DEMO_USER } from '@/lib/demo/dashboard';

export default function ScansPage() {
  return (
    <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#111827] sm:text-3xl">
              Scans of My Home
            </h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              {DEMO_USER.roomsScannedCount} rooms scanned · open any scan in Room Builder
            </p>
          </div>
          <Link
            href="/room-builder"
            className="inline-flex items-center justify-center rounded-xl bg-[#658EC2] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4a6fa3]"
          >
            + Add New Scan
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_ROOM_SCANS.map((scan) => (
            <Link
              key={scan.id}
              href={`/room-builder?scan=${scan.id}`}
              className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${
                scan.selected
                  ? 'border-[#DB2777]/40 ring-2 ring-[#DB2777]/15'
                  : 'border-[#E5E7EB] hover:border-[#DB2777]/25'
              }`}
            >
              <div className="relative aspect-[16/10] bg-[#F3F4F6]">
                <Image
                  src={scan.imageUrl}
                  alt={scan.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                {scan.selected && (
                  <span className="absolute left-3 top-3 rounded-full bg-[#DB2777] px-2.5 py-1 text-xs font-bold text-white">
                    Active
                  </span>
                )}
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-[#111827]">{scan.title}</h2>
                <p className="mt-1 text-sm text-[#6B7280]">Scanned on {scan.scannedOn}</p>
                <p className="mt-3 text-sm font-semibold text-[#DB2777]">Open in Room Builder →</p>
              </div>
            </Link>
          ))}

          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#E5E7EB] bg-white p-6 text-center">
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#F9A8D4] text-2xl text-[#DB2777]">
              +
            </span>
            <p className="font-semibold text-[#374151]">Scan a new room</p>
            <p className="mt-1 text-sm text-[#6B7280]">
              Use the Fetch &amp; Style app on your phone to capture a LiDAR scan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
