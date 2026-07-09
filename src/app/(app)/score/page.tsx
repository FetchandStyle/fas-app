import Image from 'next/image';
import Link from 'next/link';
import ScoreGauge from '@/components/ScoreGauge';
import Button from '@/components/ui/Button';
import {
  HERO_AFTER,
  HERO_BEFORE,
  HERO_COMMERCE_SCORE,
  HERO_PRODUCT,
} from '@/lib/demo/heroProduct';
import { FAS_CONTACT_URL } from '@/lib/brand';

function FieldTable({
  fields,
  tone,
}: {
  fields: Record<string, string>;
  tone: 'before' | 'after';
}) {
  const border =
    tone === 'before' ? 'border-amber-200 bg-amber-50/50' : 'border-emerald-200 bg-emerald-50/50';

  return (
    <dl className={`rounded-xl border p-5 ${border}`}>
      {Object.entries(fields).map(([key, value]) => (
        <div
          key={key}
          className="grid gap-1 border-b border-slate-200/80 py-3 last:border-0 sm:grid-cols-[180px_1fr]"
        >
          <dt className="text-sm font-semibold text-slate-600">{key}</dt>
          <dd className="text-sm text-slate-800">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function ScorePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="mb-12 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-blue">
            AI Commerce Readiness
          </p>
          <h1 className="mb-4 font-serif text-4xl text-brand-blue-gray">
            Product intelligence score
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-brand-muted">
            Precomputed demo for{' '}
            <strong className="text-slate-800">{HERO_PRODUCT.name}</strong> — how
            sparse retailer data becomes AI-ready structured catalog data.
          </p>
        </div>
        <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <ScoreGauge
            score={HERO_COMMERCE_SCORE.overall}
            caption="AI Commerce Score"
            tone="warning"
            size={220}
          />
          <p className="mt-4 text-sm font-semibold text-amber-700">
            Grade: {HERO_COMMERCE_SCORE.grade}
          </p>
        </div>
      </div>

      {/* Dimension breakdown */}
      <section className="mb-16">
        <h2 className="mb-6 font-serif text-2xl text-brand-blue-gray">
          Score breakdown — before vs after enrichment
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {HERO_COMMERCE_SCORE.dimensions.map((dim) => (
            <div
              key={dim.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="mb-3 font-semibold text-slate-800">{dim.label}</p>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-amber-700">Before: {dim.before}</span>
                <span className="font-bold text-emerald-700">After: {dim.after}</span>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-amber-400/70"
                  style={{ width: `${dim.before}%` }}
                />
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-emerald-500"
                  style={{ width: `${dim.after}%`, opacity: 0.85 }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Before / After enrichment */}
      <section className="mb-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-brand-blue-gray">
              Data enrichment — before &amp; after
            </h2>
            <p className="mt-2 text-brand-muted">
              {HERO_AFTER.addedAttributes} structured attributes added by Fetch &amp; Style AI.
            </p>
          </div>
          <Link
            href={`/product/${HERO_PRODUCT.sku}`}
            className="text-sm font-semibold text-brand-blue hover:underline"
          >
            View product page →
          </Link>
        </div>

        <div className="mb-8 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-amber-800">
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs uppercase">
                Before
              </span>
              {HERO_BEFORE.title}
            </h3>
            <FieldTable fields={HERO_BEFORE.fields} tone="before" />
            <ul className="mt-4 space-y-2 text-sm text-amber-900/80">
              {HERO_BEFORE.issues.map((issue) => (
                <li key={issue} className="flex gap-2">
                  <span aria-hidden>⚠</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-emerald-800">
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs uppercase">
                After
              </span>
              {HERO_AFTER.title}
            </h3>
            <FieldTable fields={HERO_AFTER.fields} tone="after" />
          </div>
        </div>

        <div className="flex items-center gap-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
            <Image
              src={HERO_PRODUCT.image_url}
              alt={HERO_PRODUCT.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="font-serif text-lg text-brand-blue-gray">{HERO_PRODUCT.name}</p>
            <p className="text-sm text-brand-muted">SKU: {HERO_PRODUCT.sku}</p>
          </div>
          <Button href={`/product/${HERO_PRODUCT.sku}`} variant="primary">
            View enriched product
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-gradient-to-r from-brand-blue/10 to-brand-pink/10 px-8 py-10 text-center">
        <h2 className="mb-3 font-serif text-2xl text-brand-blue-gray">
          Want a full catalog audit?
        </h2>
        <p className="mb-6 text-brand-muted">
          We can run this analysis across your entire product feed.
        </p>
        <a
          href={FAS_CONTACT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-lg bg-brand-pink px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
        >
          Contact us today
        </a>
      </section>
    </div>
  );
}
