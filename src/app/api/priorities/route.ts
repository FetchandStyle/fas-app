import { NextResponse } from 'next/server';

const PRIORITIES_DATA = [
  { id: 'price', label: 'Best Price', icon: '💵', description: 'Value for money' },
  { id: 'quality', label: 'Quality', icon: '⭐', description: 'Premium materials' },
  { id: 'style', label: 'Style First', icon: '✨', description: 'Aesthetic focus' },
  { id: 'comfort', label: 'Comfort', icon: '🛋️', description: 'Cozy living' },
  { id: 'durability', label: 'Durability', icon: '🔨', description: 'Built to last' },
  { id: 'sustainability', label: 'Eco-Friendly', icon: '🌿', description: 'Sustainable choices' },
  { id: 'speed', label: 'Fast Delivery', icon: '⚡', description: 'Quick shipping' },
  { id: 'brand', label: 'Brand Name', icon: '🏷️', description: 'Trusted brands' },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    priorities: PRIORITIES_DATA,
    total: PRIORITIES_DATA.length,
  });
}
