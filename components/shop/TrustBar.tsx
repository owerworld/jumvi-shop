import { t } from "@/lib/i18n";

export default function TrustBar() {
  const items = t.trustMicro;

  return (
    <section className="section-pad cv-auto pt-4">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/5 bg-[color:var(--surface)] px-5 py-3 text-sm text-[color:var(--muted)]">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-2 font-semibold text-[color:var(--text)]">
            <span className="h-2 w-2 rounded-full bg-brand-green" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
