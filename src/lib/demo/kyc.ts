export type KycData = {
  projectType: string;
  roomName: string;
  roomDimensions: { width: number; length: number; height: number };
  styles: string[];
  brands: string[];
  priorities: string[];
  selectedLook: string | null;
  elements: string[];
  budget: { min: number; max: number };
  completedAt?: string;
};

export const KYC_STORAGE_KEY = 'fas-demo-kyc';

export const INITIAL_KYC_DATA: KycData = {
  projectType: '',
  roomName: '',
  roomDimensions: { width: 12, length: 14, height: 9 },
  styles: [],
  brands: [],
  priorities: [],
  selectedLook: null,
  elements: [],
  budget: { min: 1000, max: 5000 },
};

export const DEMO_BRANDS = [
  'Hernest',
  'West Elm',
  'Article',
  'CB2',
  'Crate & Barrel',
  'Restoration Hardware',
  'Pottery Barn',
  'IKEA',
  'Wayfair',
  'Room & Board',
];

export function loadKycData(): KycData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KYC_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as KycData;
  } catch {
    return null;
  }
}

export function saveKycData(data: KycData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KYC_STORAGE_KEY, JSON.stringify(data));
}

export function isKycComplete(data: KycData | null): boolean {
  return Boolean(data?.completedAt);
}

export function kycSearchQuery(data: KycData): string {
  if (data.elements.length > 0) return data.elements.join(', ');
  if (data.styles.length > 0) return `${data.styles.join(' ')} furniture`;
  return 'dining table';
}

export function kycSearchResultsPath(data: KycData): string {
  return `/search/results?q=${encodeURIComponent(kycSearchQuery(data))}`;
}
