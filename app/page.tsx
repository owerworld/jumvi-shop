"use client";

import { useEffect, useMemo, useState } from "react";

const product = {
  id: "jumvi-set",
  name: "JUMVI Toss & Catch Set",
  price: 59,
  rating: 4.9,
  bullets: ["3-8 yas icin ideal", "Ekran hafif oyun", "Hediye hazir paket"],
};

export default function HomePage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [scrolled, setScrolled] = useState(false);

  const subtotal = useMemo(() => product.price * qty, [qty]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="theme-root aurora min-h-screen">
      <header
        className={`sticky top-0 z-30 w-full px-6 py-4 sm:px-10 transition-all ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        <div className={`glass glass-surface lift mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3`}>
          <div className="text-base font-semibold tracking-tight text-[color:var(--text)]">JUMVI</div>
          <nav className="hidden items-center gap-6 text-sm text-[color:var(--muted)] md:flex">
            <a href="#urun" className="focus-ring rounded-full px-3 py-1 hover:text-[color:var(--text)]">
              Urun
            </a>
            <a href="#inside" className="focus-ring rounded-full px-3 py-1 hover:text-[color:var(--text)]">
              Kutunun icinde
            </a>
            <a href="#footer" className="focus-ring rounded-full px-3 py-1 hover:text-[color:var(--text)]">
              Destek
            </a>
          </nav>
          <button
            type="button"
            className="focus-ring relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/60 text-[color:var(--text)]"
            onClick={() => setCartOpen(true)}
            aria-label="Sepeti ac"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 7h15l-1.5 9H7.5L6 7Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M6 7 5 4H2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange text-[10px] font-semibold text-white">
              {qty}
            </span>
          </button>
        </div>
      </header>

      <main id="urun" className="section-pad pt-10">
        <section className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="eyebrow">JUMVI Magaza</div>
            <h1 className="title-xl text-[color:var(--text)]">{product.name}</h1>
            <p className="body-md">
              Cocuklari harekete geciren, ekransiz oyunlari sevdirmeyi hedefleyen premium set.
            </p>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-semibold text-[color:var(--text)]">${product.price}</div>
              <div className="flex items-center gap-1 text-sm text-[color:var(--muted)]">
                <span>{product.rating}</span>
                <span className="text-brand-orange">★★★★★</span>
                <span>(128)</span>
              </div>
            </div>
            <ul className="grid gap-2 text-sm text-[color:var(--muted)]">
              {product.bullets.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand-green" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="btn-primary focus-ring rounded-[18px] px-6 py-3 text-sm"
                onClick={() => setCartOpen(true)}
              >
                Sepete ekle
              </button>
              <a href="#inside" className="btn-secondary focus-ring rounded-[18px] px-6 py-3 text-sm">
                Kutunun icinde
              </a>
            </div>
          </div>
          <div className="glass glass-surface lift relative rounded-[28px] p-6">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-blue/20 blur-3xl" />
            <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-brand-green/20 blur-3xl" />
            <div className="relative flex h-full min-h-[320px] flex-col justify-between rounded-2xl bg-white/60 p-6 text-[color:var(--muted)]">
              <div className="text-xs font-semibold">Urun gorseli</div>
              <div className="flex h-full items-center justify-center text-sm">
                Gradient + ikon placeholder
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Hafif ve guvenli</span>
                <span>Hediye hazir</span>
              </div>
            </div>
          </div>
        </section>

        <section id="inside" className="section-pad pt-16">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="title-md text-[color:var(--text)]">Kutunun icinde</h2>
                <p className="body-sm">Kutuda oyun icin gereken her sey var.</p>
              </div>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                { title: "4 paddle", desc: "Hafif, tutusu rahat" },
                { title: "4 top", desc: "Yumusak seken, ev icin uygun" },
                { title: "QR kart", desc: "Aninda gorev ve ipucu" },
              ].map((item) => (
                <div key={item.title} className="glass glass-surface lift rounded-2xl p-5">
                  <h3 className="text-lg font-semibold text-[color:var(--text)]">{item.title}</h3>
                  <p className="body-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" className="border-t border-black/5 bg-white/70 px-6 py-10 text-center text-xs text-[color:var(--muted)]">
        JUMVI Shop - legal ve iade bilgileri burada yer alir.
      </footer>

      {cartOpen ? (
        <div className="fixed inset-0 z-40">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            aria-label="Kapat"
            onClick={() => setCartOpen(false)}
          />
          <aside className="glass glass-surface lift absolute right-4 top-4 h-[calc(100%-2rem)] w-[min(420px,95vw)] rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Sepet</h3>
              <button type="button" className="text-sm text-brand-ink/60" onClick={() => setCartOpen(false)}>
                Kapat
              </button>
            </div>
            <div className="mt-6 rounded-2xl bg-white/70 p-4">
              <div className="text-sm font-semibold">{product.name}</div>
              <div className="mt-2 flex items-center justify-between text-sm text-brand-ink/60">
                <span>${product.price}</span>
                <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-2 py-1">
                  <button
                    type="button"
                    className="focus-ring h-6 w-6 rounded-full text-brand-ink"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Azalt"
                  >
                    -
                  </button>
                  <span className="min-w-[16px] text-center text-xs font-semibold">{qty}</span>
                  <button
                    type="button"
                    className="focus-ring h-6 w-6 rounded-full text-brand-ink"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Artir"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between text-sm">
              <span className="text-brand-ink/60">Ara toplam</span>
              <span className="font-semibold">${subtotal}</span>
            </div>
            <div className="mt-6">
              <div className="h-2 rounded-full bg-white/60">
                <div className="h-2 w-2/3 rounded-full bg-brand-green" />
              </div>
              <p className="mt-2 text-xs text-brand-ink/60">Ucretsiz kargo icin $80 hedefi.</p>
            </div>
            <button type="button" className="btn-primary mt-6 w-full rounded-[18px] py-3 text-sm">
              Checkout
            </button>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
