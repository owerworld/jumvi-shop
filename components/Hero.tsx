import Link from "next/link";
import content from "@/lib/content";

export default function Hero() {
  return (
    <section className="section-pad gradient-bg">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <span className="badge">Premium active play kit</span>
          <h1 className="text-4xl font-semibold tracking-tight text-brand-ink sm:text-5xl">
            {content.brand.tagline}
          </h1>
          <p className="text-lg text-brand-ink/70">
            {content.brand.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/product" className="btn-primary">
              {content.ctas.buy}
            </Link>
            <Link href="/missions" className="btn-secondary">
              {content.ctas.missions}
            </Link>
          </div>
          <p className="text-sm text-brand-ink/60">
            {content.brand.subtitle}
          </p>
        </div>
        <div className="card p-6 sm:p-8">
          <div className="flex flex-col gap-6">
            <div className="rounded-xl2 bg-brand-mist px-4 py-3 text-sm font-semibold text-brand-ink/80">
              12+ missions in every box
            </div>
            <div className="space-y-4">
              <div className="h-36 rounded-xl2 bg-gradient-to-br from-brand-blue/20 to-brand-green/20" />
              <div className="flex items-center justify-between text-xs font-semibold text-brand-ink/60">
                <span>Kid-safe design</span>
                <span>Screen-light play</span>
              </div>
            </div>
            <div className="rounded-xl2 border border-brand-orange/20 bg-brand-orange/10 px-4 py-3 text-sm font-semibold text-brand-ink/80">
              Gift-ready, delivered fast
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
