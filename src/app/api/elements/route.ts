import { NextRequest, NextResponse } from 'next/server';

const BASE_ELEMENTS = [
  { id: 'sofa', label: 'Sofa', icon: '🛋️', category: 'seating' },
  { id: 'coffee-table', label: 'Coffee Table', icon: '☕', category: 'tables' },
  { id: 'dining-table', label: 'Dining Table', icon: '🍽️', category: 'tables' },
  { id: 'bed', label: 'Bed', icon: '🛏️', category: 'bedroom' },
  { id: 'dresser', label: 'Dresser', icon: '🗄️', category: 'bedroom' },
  { id: 'desk', label: 'Desk', icon: '🖥️', category: 'office' },
  { id: 'bookshelf', label: 'Bookshelf', icon: '📚', category: 'storage' },
  { id: 'rug', label: 'Rug', icon: '🏠', category: 'decor' },
  { id: 'floor-lamp', label: 'Floor Lamp', icon: '💡', category: 'lighting' },
  { id: 'table-lamp', label: 'Table Lamp', icon: '🔦', category: 'lighting' },
  { id: 'accent-chair', label: 'Accent Chair', icon: '🪑', category: 'seating' },
  { id: 'ottoman', label: 'Ottoman', icon: '🟤', category: 'seating' },
  { id: 'wall-art', label: 'Wall Art', icon: '🖼️', category: 'decor' },
  { id: 'mirror', label: 'Mirror', icon: '🪞', category: 'decor' },
  { id: 'curtains', label: 'Curtains', icon: '🪟', category: 'decor' },
  { id: 'plants', label: 'Plants', icon: '🌿', category: 'decor' },
  { id: 'throw-pillows', label: 'Throw Pillows', icon: '🛋️', category: 'decor' },
  { id: 'side-table', label: 'Side Table', icon: '🪵', category: 'tables' },
  { id: 'tv-stand', label: 'TV Stand', icon: '📺', category: 'entertainment' },
  { id: 'bar-cart', label: 'Bar Cart', icon: '🍸', category: 'entertainment' },
];

const STYLE_ELEMENTS: Record<string, string[]> = {
  modern: ['sofa', 'coffee-table', 'floor-lamp', 'rug', 'wall-art', 'accent-chair'],
  traditional: ['sofa', 'coffee-table', 'bookshelf', 'curtains', 'mirror', 'table-lamp'],
  coastal: ['sofa', 'rug', 'plants', 'mirror', 'throw-pillows', 'floor-lamp'],
  industrial: ['sofa', 'coffee-table', 'bookshelf', 'floor-lamp', 'wall-art', 'bar-cart'],
  'mid-century': ['sofa', 'accent-chair', 'coffee-table', 'floor-lamp', 'rug', 'wall-art'],
  bohemian: ['rug', 'plants', 'throw-pillows', 'wall-art', 'floor-lamp', 'ottoman'],
  minimalist: ['sofa', 'coffee-table', 'floor-lamp', 'rug', 'plants'],
  scandinavian: ['sofa', 'coffee-table', 'rug', 'plants', 'floor-lamp', 'throw-pillows'],
  farmhouse: ['dining-table', 'bookshelf', 'rug', 'curtains', 'plants', 'wall-art'],
  contemporary: ['sofa', 'accent-chair', 'coffee-table', 'floor-lamp', 'wall-art', 'rug'],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const styles = searchParams.get('styles')?.split(',').filter(Boolean) ?? [];

  let recommendedIds: string[] = [];
  styles.forEach((style) => {
    recommendedIds = [...recommendedIds, ...(STYLE_ELEMENTS[style] ?? [])];
  });

  const uniqueIds = [...new Set(recommendedIds)];
  const elementIds = uniqueIds.length > 0 ? uniqueIds : BASE_ELEMENTS.map((e) => e.id);

  const elements = elementIds
    .map((id) => BASE_ELEMENTS.find((e) => e.id === id))
    .filter(Boolean);

  return NextResponse.json({
    success: true,
    elements,
    total: elements.length,
    basedOn: { styles },
  });
}
