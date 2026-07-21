import Image from 'next/image';
import { FAS_MARKETING_HOME_URL } from '@/lib/brand';
import SignInForm from '@/components/SignInForm';

export default function SignInLandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-pink-50 px-6 py-12">
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
          placeholder="empty"
          style={{ color: 'transparent', filter: 'blur(0px)' }}
        />
      </a>

      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-gray-900">Welcome back</h1>
          <p className="mt-3 text-sm text-gray-500">
            Sign in to access your digital twin — scans, wishlist, recommendations, and room
            builder.
          </p>
        </div>

        <SignInForm />

        <p className="mt-6 text-center text-xs text-gray-400">
          Demo mode — no account required for the trade show.
        </p>
      </div>
    </div>
  );
}
