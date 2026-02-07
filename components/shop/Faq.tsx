import Link from "next/link";
import { t } from "@/lib/i18n";

export default function Faq() {
  return (
    <section id="faq" className="section-pad pt-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="title-md text-[color:var(--text)]">{t.faq.title}</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {t.faq.items.map((item) => (
            <details key={item.q} className="surface min-h-[120px] rounded-2xl border border-black/5 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-[color:var(--text)]">
                {item.q}
              </summary>
              <p className="body-sm mt-2">
                {item.q === "Returns" || item.q === "Shipping" ? (
                  <span>
                    {item.a} <Link href="#destek" className="underline">{t.hero.support}</Link>
                  </span>
                ) : (
                  item.a
                )}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
