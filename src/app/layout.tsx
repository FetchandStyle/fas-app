import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fetch & Style',
  description:
    'AI-powered home design — search, enrichment, and personalized recommendations',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-gray-50">{children}</body>
    </html>
  );
}
