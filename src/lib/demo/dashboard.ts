/** Mock signed-in user for trade-show demo (no Firebase yet). */
export const DEMO_USER = {
  id: 'demo-user',
  displayName: 'Alex',
  email: 'alex@example.com',
  avatarUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80',
  wishlistCount: 24,
  purchaseCount: 12,
  roomsScannedCount: 7,
};

export interface RoomScan {
  id: string;
  title: string;
  scannedOn: string;
  imageUrl: string;
  /** Highlighted / selected room in the demo (pink overlay). */
  selected?: boolean;
}

export interface WishlistItem {
  sku: string;
  name: string;
  price: number;
  imageUrl: string;
}

export const DEMO_ROOM_SCANS: RoomScan[] = [
  {
    id: 'scan-1',
    title: 'Santa Monica Home',
    scannedOn: 'May 12, 2024',
    imageUrl:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&h=280&q=80',
  },
  {
    id: 'scan-2',
    title: 'Big Bear Cabin',
    scannedOn: 'Apr 3, 2024',
    imageUrl:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&h=280&q=80',
  },
  {
    id: 'scan-3',
    title: 'New Office',
    scannedOn: 'Jan 18, 2024',
    selected: true,
    imageUrl:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&h=280&q=80',
  },
];

export const DEMO_WISHLIST: WishlistItem[] = [
  {
    sku: 'WL-001',
    name: 'Model 21 Sofa',
    price: 1295,
    imageUrl:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&h=400&q=80',
  },
  {
    sku: 'WL-002',
    name: 'Round Marble Coffee Table',
    price: 429,
    imageUrl:
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=400&h=400&q=80',
  },
  {
    sku: 'WL-003',
    name: 'Green Accent Chair',
    price: 259,
    imageUrl:
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=400&h=400&q=80',
  },
  {
    sku: 'WL-004',
    name: 'Pendant Light',
    price: 189,
    imageUrl:
      'https://images.unsplash.com/photo-1513505193045-4fc17ac0a254?auto=format&fit=crop&w=400&h=400&q=80',
  },
];
