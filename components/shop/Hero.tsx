"use client";

import { t } from "@/lib/i18n";
import { product } from "@/lib/product";
import Gallery from "@/components/shop/Gallery";
import type { GalleryItem } from "@/components/shop/Gallery";

type HeroProps = {
  onAddToCart: () => void;
  onOpenLightbox: (index: number) => void;
  galleryItems: GalleryItem[];
};

export default function Hero({ onAddToCart, onOpenLightbox, galleryItems }: HeroProps) {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6" id="hero-trigger">
        <p className="eyebrow">{t.hero.kicker}</p>
        <h1 className="title-xl text-[color:var(--text)] leading-tight">{t.hero.title}</h1>
        <p className="body-md">{t.hero.subtitle}</p>
        <div className="flex items-center gap-4 text-sm text-[color:var(--muted)]">
          <span className="text-3xl font-semibold text-[color:var(--text)]">${product.price}</span>
          <span>•</span>
          <span>
            {product.rating} ★ ({product.reviewCount} {t.hero.reviewsLabel})
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {t.badges.map((badge) => (
            <span key={badge} className="badge">
              {badge}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-[color:var(--muted)]">
          {t.trustMicro.map((item) => (
            <span key={item} className="rounded-full border border-black/5 bg-white/60 px-3 py-1">
              {item}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-primary rounded-[18px] px-6 py-3 text-sm" onClick={onAddToCart}>
            {t.sticky.cta}
          </button>
          <a href="#inside" className="btn-secondary rounded-[18px] px-6 py-3 text-sm">
            {t.inside.title}
          </a>
        </div>
        <p className="text-xs text-[color:var(--muted)]">{t.hero.microCta}</p>
        <div className="flex flex-wrap items-center gap-4 text-xs text-[color:var(--muted)]">
          {t.trustMicro.map((item, index) => (
            <div key={item} className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${index === 0 ? "bg-brand-green" : index === 1 ? "bg-brand-blue" : "bg-brand-orange"}`} />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="rounded-2xl border border-black/5 bg-[color:var(--surface)] px-4 py-3 text-xs text-[color:var(--muted)]">
            <div className="flex flex-wrap items-center gap-3">
              <span>{t.hero.delivery}</span>
              <span>•</span>
              <span>{t.hero.freeShipping}</span>
              <span>•</span>
              <span>{t.hero.returns}</span>
              <a href="#destek" className="underline">
                {t.hero.support}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="glass glass-surface relative rounded-[24px] p-5">
        <Gallery items={galleryItems} onOpen={onOpenLightbox} />
      </div>
    </section>
  );
}
