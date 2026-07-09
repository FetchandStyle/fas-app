import { NextRequest, NextResponse } from 'next/server';
import { IS_DEMO_MODE } from '@/lib/demo/config';
import { demoSearch } from '@/lib/demo/catalog';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const query = (formData.get('query') as string | null) ?? '';
    const image = formData.get('image') as File | null;
    const limit = parseInt((formData.get('limit') as string) || '50', 10);

    if (!query && !image) {
      return NextResponse.json(
        { error: 'Either query or image is required' },
        { status: 400 },
      );
    }

    if (IS_DEMO_MODE) {
      const results = image
        ? demoSearch('dining table', limit)
        : demoSearch(query, limit);
      return NextResponse.json({ results });
    }

    const apiUrl = process.env.NEXT_PUBLIC_FAS_API_URL;
    const apiKey = process.env.APP_API_KEY;
    if (!apiUrl || !apiKey) {
      return NextResponse.json(
        { error: 'API not configured. Enable demo mode or set FAS_API_URL.' },
        { status: 500 },
      );
    }

    const upstream = new FormData();
    if (query) upstream.append('query', query);
    if (image) upstream.append('image', image);
    upstream.append('limit', String(limit));
    upstream.append('offset', '0');

    const response = await fetch(`${apiUrl}/search`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey },
      body: upstream,
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: text }, { status: response.status });
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
