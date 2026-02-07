import content from "@/lib/content";

export default function HowItWorks() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
          <p className="text-sm text-brand-ink/60">Three steps to playful learning.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {content.howItWorks.map((step, index) => (
            <div key={step.title} className="card p-6">
              <div className="mb-3 text-xs font-semibold text-brand-ink/50">0{index + 1}</div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-brand-ink/60">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
