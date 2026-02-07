import content from "@/lib/content";

export default function TrustBar() {
  return (
    <section className="section-pad pt-6">
      <div className="mx-auto grid max-w-6xl gap-3 rounded-xl2 border border-black/5 bg-white/80 px-6 py-4 shadow-soft sm:grid-cols-2 lg:grid-cols-4">
        {content.trustBar.map((item) => (
          <div key={item} className="flex items-center gap-3 text-sm font-semibold text-brand-ink/70">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-blue/70" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
