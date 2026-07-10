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

export interface PurchaseLineItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface PurchaseOrder {
  id: string;
  orderDate: string;
  status: 'Delivered' | 'Shipped' | 'Processing';
  items: PurchaseLineItem[];
  total: number;
}

export const DEMO_PURCHASES: PurchaseOrder[] = [
  {
    id: 'ORD-1042',
    orderDate: 'March 8, 2024',
    status: 'Delivered',
    total: 818,
    items: [
      {
        sku: 'HEFTDT-8404',
        name: 'Magnus 31" Round Sintered Stone Dining Table',
        price: 559,
        quantity: 1,
        imageUrl: '/demo/products/HEFTDT-8404.jpg',
      },
      {
        sku: 'HEFTDC-5510',
        name: 'Ari Upholstered Dining Chair (Set of 2)',
        price: 259,
        quantity: 1,
        imageUrl: '/demo/products/HEFTDC-5510.jpg',
      },
    ],
  },
  {
    id: 'ORD-0987',
    orderDate: 'January 22, 2024',
    status: 'Delivered',
    total: 1048,
    items: [
      {
        sku: 'HEFTSB-3202',
        name: 'Lund 3-Seater Convertible Sofa Bed',
        price: 899,
        quantity: 1,
        imageUrl: '/demo/products/HEFTSB-3202.jpg',
      },
      {
        sku: 'HEFTST-2201',
        name: 'Oslo Round Side Table with Storage Shelf',
        price: 149,
        quantity: 1,
        imageUrl: '/demo/products/HEFTST-2201.jpg',
      },
    ],
  },
  {
    id: 'ORD-0911',
    orderDate: 'November 5, 2023',
    status: 'Delivered',
    total: 1178,
    items: [
      {
        sku: 'HEFTCT-4410',
        name: 'Bergen Oval Sintered Stone Coffee Table',
        price: 429,
        quantity: 1,
        imageUrl: '/demo/products/HEFTCT-4410.jpg',
      },
      {
        sku: 'HEFTSF-7730',
        name: 'Faro 2-Seater Boucle Accent Sofa',
        price: 749,
        quantity: 1,
        imageUrl: '/demo/products/HEFTSF-7730.jpg',
      },
    ],
  },
];

export interface CartLineItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  source: string;
}

export const DEMO_CART: CartLineItem[] = [
  {
    sku: 'HEFTDT-8404',
    name: 'Magnus 31" Round Sintered Stone Dining Table',
    price: 559,
    quantity: 1,
    imageUrl: '/demo/products/HEFTDT-8404.jpg',
    source: 'hernest',
  },
  {
    sku: 'HEFTCT-4410',
    name: 'Bergen Oval Sintered Stone Coffee Table',
    price: 429,
    quantity: 1,
    imageUrl: '/demo/products/HEFTCT-4410.jpg',
    source: 'hernest',
  },
  {
    sku: 'HEFTDC-5510',
    name: 'Ari Upholstered Dining Chair (Set of 2)',
    price: 259,
    quantity: 2,
    imageUrl: '/demo/products/HEFTDC-5510.jpg',
    source: 'hernest',
  },
];
