import PlaceholderPage from '@/components/app/PlaceholderPage';

const pages = [
  'design-history',
  'saved-rooms',
  'addresses',
  'payment',
  'settings',
  'help',
] as const;

type Props = { params: Promise<{ slug: string }> };

const TITLES: Record<string, string> = {
  'design-history': 'Design History',
  'saved-rooms': 'Saved Rooms',
  addresses: 'My Addresses',
  payment: 'Payment Methods',
  settings: 'Account Settings',
  help: 'Help & Support',
};

export function generateStaticParams() {
  return pages.map((slug) => ({ slug }));
}

export default async function AccountSubPage({ params }: Props) {
  const { slug } = await params;
  return <PlaceholderPage title={TITLES[slug] ?? 'Account'} />;
}
