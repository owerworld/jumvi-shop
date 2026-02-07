"use client";

import { useEffect, useState } from "react";
import { t } from "@/lib/i18n";

type StickyBuyBarProps = {
  price: number;
  rating: number;
  onAddToCart: () => void;
};

export default function StickyBuyBar({ price, rating, onAddToCart }: StickyBuyBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-trigger");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-black/5 bg-[color:var(--surface)] px-5 py-3 backdrop-blur transition-all motion-reduce:transition-none md:bottom-4 md:mx-auto md:max-w-6xl md:rounded-2xl md:border ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-[color:var(--muted)]">
          <span className="font-semibold text-[color:var(--text)]">{t.hero.title}</span>
          <span className="mx-2">•</span>
          <span>${price}</span>
          <span className="mx-2">•</span>
          <span>{rating} ★</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-[color:var(--muted)] md:inline">{t.sticky.returns}</span>
          <button type="button" className="btn-primary rounded-[18px] px-4 py-2 text-xs" onClick={onAddToCart}>
            {t.sticky.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
