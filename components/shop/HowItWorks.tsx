import Image from "next/image";
import { t } from "@/lib/i18n";

export default function HowItWorks() {
  const steps = t.how.steps;

  return (
    <section className="section-pad pt-12">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <h2 className="title-md text-[color:var(--text)]">{t.how.title}</h2>
          <div className="mt-6 grid gap-3">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue/15 text-sm font-semibold text-brand-blue">
                  0{index + 1}
                </span>
                <span className="text-sm font-semibold text-[color:var(--text)]">{step}</span>
              </div>
            ))}
          </div>
          <p className="body-sm mt-6">{t.how.note}</p>
        </div>
        <div className="surface rounded-2xl border border-black/5 p-5">
          <div className="relative h-72 w-full overflow-hidden rounded-xl2 bg-white/80">
            <Image
              src="/phoneqr.png"
              alt={t.images.phoneAlt}
              fill
              sizes="(max-width: 1024px) 90vw, 420px"
              className="object-contain"
              loading="lazy"
            />
          </div>
          <p className="mt-3 text-xs text-[color:var(--muted)]">{t.how.caption}</p>
        </div>
      </div>
    </section>
  );
}
