export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif text-2xl text-gray-900">{title}</h1>
      <p className="mt-2 max-w-md text-gray-500">Coming in the next phase of the demo build.</p>
    </div>
  );
}
