import Image from "next/image";
import Link from "next/link";
import content from "@/lib/content";

export default function Hero() {
  return (
    <section className="section-pad gradient-bg">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <span className="badge">Premium aktif oyun kiti</span>
          <h1 className="title-xl">{content.brand.tagline}</h1>
          <p className="body-md">{content.brand.description}</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-primary cursor-not-allowed opacity-60" disabled aria-disabled="true">
              {content.ctas.buy}
            </button>
            <Link href="/missions" className="btn-secondary">
              {content.ctas.missions}
            </Link>
          </div>
          <p className="body-sm">{content.brand.subtitle}</p>
        </div>
        <div className="card relative overflow-hidden p-6 sm:p-8">
          <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-brand-blue/20 blur-2xl" />
          <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-brand-green/20 blur-2xl" />
          <div className="relative flex flex-col gap-6">
            <div className="rounded-xl2 bg-brand-mist px-4 py-3 text-sm font-semibold text-brand-ink/80">
              Her kutuda 12+ gorev
            </div>
            <div className="space-y-4">
              <div className="relative h-52 overflow-hidden rounded-xl2 bg-white/70">
                <Image
                  src="/jumvi-hero.png"
                  alt="JUMVI oyun kiti"
                  fill
                  sizes="(max-width: 1024px) 90vw, 420px"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-brand-ink/60">
                <span>Cocuk dostu tasarim</span>
                <span>Ekran hafif oyun</span>
              </div>
            </div>
            <div className="rounded-xl2 border border-brand-orange/20 bg-brand-orange/10 px-4 py-3 text-sm font-semibold text-brand-ink/80">
              Hediye hazir ve hizli teslim
            </div>
          </div>
          <div className="absolute right-6 top-8 h-14 w-14 rounded-2xl bg-white/70 shadow-glow animate-float" />
        </div>
      </div>
    </section>
  );
}
