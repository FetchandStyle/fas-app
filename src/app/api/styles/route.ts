import { NextResponse } from 'next/server';

const STYLES_DATA = [
  {
    id: 'modern',
    label: 'Modern',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400',
    description: 'Clean lines and minimalist aesthetics',
  },
  {
    id: 'traditional',
    label: 'Traditional',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=400',
    description: 'Classic and timeless elegance',
  },
  {
    id: 'coastal',
    label: 'Coastal',
    image: 'https://images.unsplash.com/photo-1558603668-6570496b66f8?auto=format&fit=crop&q=80&w=400',
    description: 'Beach-inspired relaxed vibes',
  },
  {
    id: 'industrial',
    label: 'Industrial',
    image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&q=80&w=400',
    description: 'Raw materials and urban edge',
  },
  {
    id: 'mid-century',
    label: 'Mid Century',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=400',
    description: 'Retro charm from the 50s–60s',
  },
  {
    id: 'bohemian',
    label: 'Bohemian',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=400',
    description: 'Eclectic and free-spirited',
  },
  {
    id: 'minimalist',
    label: 'Minimalist',
    image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=400',
    description: 'Less is more philosophy',
  },
  {
    id: 'scandinavian',
    label: 'Scandinavian',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400',
    description: 'Nordic simplicity and warmth',
  },
  {
    id: 'farmhouse',
    label: 'Farmhouse',
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=400',
    description: 'Rustic country comfort',
  },
  {
    id: 'contemporary',
    label: 'Contemporary',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400',
    description: 'Current trends and sleek design',
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    styles: STYLES_DATA,
    total: STYLES_DATA.length,
  });
}
