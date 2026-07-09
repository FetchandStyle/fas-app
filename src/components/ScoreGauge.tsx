interface ScoreGaugeProps {
  score: number;
  caption?: string;
  tone?: 'success' | 'good' | 'warning' | 'critical';
  size?: number;
}

const TONE_COLORS: Record<NonNullable<ScoreGaugeProps['tone']>, string> = {
  success: '#16a34a',
  good: '#658EC2',
  warning: '#d97706',
  critical: '#dc2626',
};

export default function ScoreGauge({
  score,
  caption,
  tone = 'good',
  size = 200,
}: ScoreGaugeProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const radius = (size - 18) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);
  const color = TONE_COLORS[tone];

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Score ${clamped} out of 100`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={12}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 600ms ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {caption && (
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {caption}
          </p>
        )}
        <p className="text-5xl font-bold text-slate-900">{clamped}</p>
        <p className="text-sm text-slate-500">out of 100</p>
      </div>
    </div>
  );
}
