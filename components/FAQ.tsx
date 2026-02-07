import content from "@/lib/content";

export default function FAQ() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
          <p className="text-sm text-brand-ink/60">Quick answers before you play.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {content.faq.map((item) => (
            <div key={item.q} className="card p-5">
              <h3 className="text-sm font-semibold text-brand-ink">{item.q}</h3>
              <p className="mt-2 text-sm text-brand-ink/60">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
