import content from "@/lib/content";

export default function TrustBar() {
  return (
    <section className="section-pad pt-6">
      <div className="mx-auto grid max-w-6xl gap-3 rounded-xl2 border border-black/5 bg-white px-6 py-4 shadow-soft sm:grid-cols-2 lg:grid-cols-4">
        {content.trustBar.map((item) => (
          <div key={item} className="text-sm font-semibold text-brand-ink/70">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
