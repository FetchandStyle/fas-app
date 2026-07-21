'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    // UI-only demo: no auth API — enter the app like a signed-in user
    setSubmitting(true);
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#374151]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3.5 py-2.5 text-sm text-[#111827] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#658EC2] focus:ring-2 focus:ring-[#658EC2]/20"
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-[#374151]">
            Password
          </label>
          <button
            type="button"
            className="text-xs font-medium text-[#658EC2] hover:text-[#4a6fa3]"
            onClick={() => {
              /* UI only — no reset flow */
            }}
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full rounded-lg border border-[#E5E7EB] bg-white py-2.5 pl-3.5 pr-11 text-sm text-[#111827] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#658EC2] focus:ring-2 focus:ring-[#658EC2]/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#374151]"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                <path d="M1 1l22 22" />
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          className="h-4 w-4 rounded border-[#D1D5DB] text-[#DB2777] focus:ring-[#DB2777]/30"
        />
        <span className="text-sm text-[#6B7280]">Remember me</span>
      </label>

      <button
        type="submit"
        disabled={submitting || !email.trim() || !password}
        className="inline-flex w-full items-center justify-center rounded-lg bg-[#DB2777] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#BE185D] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Signing in…' : 'Sign in'}
      </button>

      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E5E7EB]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-[#9CA3AF]">or</span>
        </div>
      </div>

      <Link
        href="/dashboard"
        className="inline-flex w-full items-center justify-center rounded-lg border border-[#E5E7EB] bg-white px-6 py-3 text-sm font-semibold text-[#374151] transition hover:bg-[#F9FAFB]"
      >
        Continue as demo user
      </Link>
    </form>
  );
}
