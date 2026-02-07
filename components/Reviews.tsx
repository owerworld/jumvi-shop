import content from "@/lib/content";

export default function Reviews() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h2 className="title-md">Aileler cok sevdi</h2>
          <p className="body-sm">Ilk kullananlardan gercek yorumlar.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {content.reviews.map((review) => (
            <div key={review.name} className="card p-6">
              <div className="mb-3 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-brand-orange/60" />
                <span className="h-2 w-2 rounded-full bg-brand-orange/60" />
                <span className="h-2 w-2 rounded-full bg-brand-orange/60" />
                <span className="h-2 w-2 rounded-full bg-brand-orange/60" />
                <span className="h-2 w-2 rounded-full bg-brand-orange/60" />
              </div>
              <p className="body-md">"{review.text}"</p>
              <p className="mt-4 text-xs font-semibold text-brand-ink/60">{review.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
