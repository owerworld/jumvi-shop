"use client";

import { t } from "@/lib/i18n";

type FinalCtaProps = {
  onAddToCart: () => void;
};

export default function FinalCta({ onAddToCart }: FinalCtaProps) {
  return (
    <section className="section-pad pt-12">
      <div className="surface mx-auto max-w-6xl rounded-3xl border border-black/5 p-8 text-center">
        <h2 className="title-md text-[color:var(--text)]">{t.final.title}</h2>
        <p className="body-sm mt-2">{t.final.subtitle}</p>
        <button type="button" className="btn-primary mt-6 rounded-[18px] px-8 py-3 text-sm" onClick={onAddToCart}>
          {t.sticky.cta}
        </button>
      </div>
    </section>
  );
}
