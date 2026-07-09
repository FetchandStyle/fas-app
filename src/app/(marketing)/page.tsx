import Link from 'next/link';
import Image from 'next/image';
import { FAS_MARKETING_HOME_URL } from '@/lib/brand';

export default function SignInLandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-pink-50 px-6">
      <a
        href={FAS_MARKETING_HOME_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-10"
      >
        <Image
          src="/faslogo.png"
          alt="Fetch & Style"
          width={180}
          height={64}
          className="h-14 w-auto"
          priority
        />
      </a>

      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-lg">
        <h1 className="font-serif text-3xl text-gray-900">Welcome to Fetch &amp; Style</h1>
        <p className="mt-3 text-gray-500">
          Sign in to access your digital twin — scans, wishlist, recommendations, and room builder.
        </p>

        <Link
          href="/dashboard"
          className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-pink-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
        >
          Continue as demo user
        </Link>

        <p className="mt-4 text-xs text-gray-400">
          Demo mode — no account required for the trade show.
        </p>
      </div>
    </div>
  );
}
