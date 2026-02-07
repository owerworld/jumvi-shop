import content from "@/lib/content";

export default function InsideBox() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">What's inside</h2>
          <p className="text-sm text-brand-ink/60">Everything you need for instant play.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.insideBox.map((item) => (
            <div key={item.title} className="card p-5">
              <div className="mb-4 h-10 w-10 rounded-full bg-brand-blue/20" />
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-brand-ink/60">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
