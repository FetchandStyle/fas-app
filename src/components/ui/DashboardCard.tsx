interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function DashboardCard({ children, className = '' }: DashboardCardProps) {
  return (
    <section
      className={`rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionHeader({
  title,
  href,
  linkLabel = 'View all',
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-[17px] font-bold text-[#111827]">{title}</h2>
      {href && (
        <a
          href={href}
          className="shrink-0 text-sm font-semibold text-[#DB2777] hover:text-[#BE185D]"
        >
          {linkLabel}
        </a>
      )}
    </div>
  );
}
