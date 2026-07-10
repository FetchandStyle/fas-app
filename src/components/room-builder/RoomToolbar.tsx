'use client';

const TOOLS = [
  { id: 'build', label: 'Build Room', icon: 'cube' },
  { id: 'decorate', label: 'Decorate', icon: 'decorate' },
  { id: 'view', label: 'View', icon: 'view' },
  { id: 'lighting', label: 'Lighting', icon: 'lighting' },
  { id: 'measure', label: 'Measurements', icon: 'measure' },
] as const;

export type ToolId = (typeof TOOLS)[number]['id'];

function ToolIcon({ name }: { name: string }) {
  const cls = 'h-5 w-5';
  switch (name) {
    case 'cube':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M12 2l8 4.5v7L12 18l-8-4.5v-7L12 2z" />
          <path d="M12 11.5V18M12 11.5L4 7M12 11.5l8-4.5" />
        </svg>
      );
    case 'decorate':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M12 3l1.5 4.5H18l-3.5 2.5 1.5 4.5L12 14l-4 4.5 1.5-4.5L5 7.5h4.5L12 3z" />
        </svg>
      );
    case 'view':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'lighting':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M9 18h6M10 22h4M12 2a6 6 0 00-3 11v1h6v-1a6 6 0 00-3-11z" />
        </svg>
      );
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M3 7h18M3 12h12M3 17h8" />
        </svg>
      );
  }
}

export default function RoomToolbar({
  active,
  onChange,
}: {
  active: ToolId;
  onChange: (id: ToolId) => void;
}) {
  return (
    <aside className="hidden w-[72px] shrink-0 flex-col border-r border-[#E5E7EB] bg-white py-4 md:flex">
      {TOOLS.map((tool) => {
        const isActive = active === tool.id;
        return (
          <button
            key={tool.id}
            type="button"
            onClick={() => onChange(tool.id)}
            title={tool.label}
            className={`mx-2 mb-1 flex flex-col items-center gap-1 rounded-xl px-2 py-3 text-[10px] font-medium transition-colors ${
              isActive
                ? 'bg-[#FFF0F5] text-[#DB2777] ring-1 ring-[#DB2777]/25'
                : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#374151]'
            }`}
          >
            <ToolIcon name={tool.icon} />
            <span className="max-w-[56px] text-center leading-tight">{tool.label}</span>
          </button>
        );
      })}
    </aside>
  );
}
