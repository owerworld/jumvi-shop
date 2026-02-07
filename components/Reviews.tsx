import content from "@/lib/content";

export default function Reviews() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Parents love it</h2>
          <p className="text-sm text-brand-ink/60">Real reactions from early testers.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {content.reviews.map((review) => (
            <div key={review.name} className="card p-6">
              <p className="text-sm text-brand-ink/70">"{review.text}"</p>
              <p className="mt-4 text-xs font-semibold text-brand-ink/60">{review.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
