import SearchBar from '@/components/SearchBar';
import DashboardCard from '@/components/ui/DashboardCard';

const SUGGESTIONS = [
  'round dining table',
  'sintered stone table',
  'modern coffee table',
  'sideboard cabinet',
];

export default function SearchPage() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <DashboardCard className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">
            Search the demo catalog
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Text or image search — works offline with local Hernest products.
          </p>
        </div>

        <SearchBar variant="hero" />

        <div className="mt-8">
          <p className="mb-3 text-sm font-semibold text-[#374151]">Try a query:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((q) => (
              <a
                key={q}
                href={`/search/results?q=${encodeURIComponent(q)}`}
                className="rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-1.5 text-sm font-medium text-[#658EC2] transition hover:border-[#658EC2] hover:bg-white"
              >
                {q}
              </a>
            ))}
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
