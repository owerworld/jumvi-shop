import { t } from "@/lib/i18n";

export default function Testimonials() {
  return (
    <section className="section-pad cv-auto pt-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="title-md text-[color:var(--text)]">{t.reviews.title}</h2>
            <p className="body-sm mt-2">{t.reviewsCta.subtitle}</p>
          </div>
          <div className="text-sm text-[color:var(--muted)]">{t.reviews.summary}</div>
        </div>
        <div className="mt-6 flex gap-4 overflow-x-auto pb-2" style={{ scrollSnapType: "x mandatory" }}>
          {t.reviews.items.map((item) => (
            <div
              key={item.name}
              className="surface min-w-[260px] snap-start rounded-2xl border border-black/5 p-5"
            >
              <div className="text-sm text-brand-orange">★★★★★</div>
              <p className="body-sm mt-3">“{item.text}”</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="font-semibold text-[color:var(--text)]">{item.name}</span>
                {item.verified ? <span className="text-[color:var(--muted)]">{t.reviews.verified}</span> : null}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <p className="text-xs font-semibold text-[color:var(--muted)]">{t.reviews.photos}</p>
          <div className="mt-3 grid grid-cols-3 gap-3 md:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-16 rounded-xl2 border border-black/5 bg-white/70" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
