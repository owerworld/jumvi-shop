import { t } from "@/lib/i18n";

export default function Guarantee() {
  return (
    <section className="section-pad pt-10">
      <div className="mx-auto max-w-6xl rounded-3xl border border-black/5 bg-[color:var(--surface)] px-6 py-6 text-center">
        <h3 className="text-lg font-semibold text-[color:var(--text)]">{t.guarantee.title}</h3>
        <p className="body-sm mt-2">{t.guarantee.subtitle}</p>
      </div>
    </section>
  );
}
