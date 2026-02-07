import { t } from "@/lib/i18n";

export default function Benefits() {
  const items = t.benefits.items;

  return (
    <section className="section-pad cv-auto pt-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="title-md text-[color:var(--text)]">{t.benefits.title}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="surface min-h-[140px] rounded-2xl border border-black/5 p-5">
              <h3 className="text-lg font-semibold text-[color:var(--text)]">{item.title}</h3>
              <p className="body-sm mt-2">{item.desc}</p>
              <p className="mt-3 text-xs font-semibold text-[color:var(--text)]">{item.result}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
