import { NextRequest, NextResponse } from 'next/server';
import { IS_DEMO_MODE } from '@/lib/demo/config';
import { demoProductBySku } from '@/lib/demo/catalog';

export const runtime = 'nodejs';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    if (IS_DEMO_MODE) {
      const product = demoProductBySku(id);
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    const apiUrl = process.env.NEXT_PUBLIC_FAS_API_URL;
    const apiKey = process.env.APP_API_KEY;
    if (!apiUrl || !apiKey) {
      return NextResponse.json(
        { error: 'API not configured. Enable demo mode or set FAS_API_URL.' },
        { status: 500 },
      );
    }

    const response = await fetch(`${apiUrl}/product/${id}`, {
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: response.status },
      );
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error('Product fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
