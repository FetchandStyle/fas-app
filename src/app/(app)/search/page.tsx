import SearchBar from '@/components/SearchBar';

const SUGGESTIONS = [
  'round dining table',
  'sintered stone table',
  'modern coffee table',
  'sideboard cabinet',
];

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-10 text-center">
        <h1 className="mb-3 font-serif text-4xl text-brand-blue-gray">
          Search the demo catalog
        </h1>
        <p className="text-brand-muted">
          Text or image search — offline-safe demo with Hernest products.
        </p>
      </div>

      <SearchBar variant="hero" />

      <div className="mt-8">
        <p className="mb-3 text-sm font-medium text-brand-muted">Try a query:</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((q) => (
            <a
              key={q}
              href={`/search/results?q=${encodeURIComponent(q)}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-brand-blue transition hover:border-brand-blue hover:bg-brand-blue/5"
            >
              {q}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
