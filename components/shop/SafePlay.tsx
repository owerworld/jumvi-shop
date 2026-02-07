import { t } from "@/lib/i18n";

export default function SafePlay() {
  const rules = [
    { text: t.safe.rules[0], color: "bg-brand-blue/70" },
    { text: t.safe.rules[1], color: "bg-brand-green/70" },
    { text: t.safe.rules[2], color: "bg-brand-orange/70" },
  ];

  return (
    <section className="section-pad pt-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="title-md text-[color:var(--text)]">{t.safe.title}</h2>
        <div className="mt-6 grid gap-3">
          {rules.map((rule) => (
            <div key={rule.text} className="surface flex items-center gap-3 rounded-2xl border border-black/5 px-4 py-3 text-sm text-[color:var(--muted)]">
              <span className={`h-2.5 w-2.5 rounded-full ${rule.color}`} />
              <span>{rule.text}</span>
            </div>
          ))}
        </div>
        <p className="body-sm mt-4">{t.safe.compliance}</p>
      </div>
    </section>
  );
}
