"use client";

import Link from "next/link";
import { t } from "@/lib/i18n";

type HeaderProps = {
  cartCount: number;
  onCartOpen: () => void;
};

export default function Header({ cartCount, onCartOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full px-5 py-3 sm:px-10">
      <div className="glass glass-surface mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5">
        <div className="text-base font-semibold tracking-tight">JUMVI</div>
        <nav className="hidden items-center gap-6 text-sm text-[color:var(--muted)] md:flex">
          <Link href="#urun" className="focus-ring rounded-full px-3 py-1 hover:text-[color:var(--text)]">
            {t.nav.product}
          </Link>
          <Link href="#inside" className="focus-ring rounded-full px-3 py-1 hover:text-[color:var(--text)]">
            {t.nav.inside}
          </Link>
          <Link href="#destek" className="focus-ring rounded-full px-3 py-1 hover:text-[color:var(--text)]">
            {t.nav.support}
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCartOpen}
            className="btn-primary inline-flex rounded-[16px] px-3 py-2 text-[11px] md:hidden"
          >
            {t.sticky.cta}
          </button>
          <button
            type="button"
            className="focus-ring relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/60 text-[color:var(--text)]"
            onClick={onCartOpen}
            aria-label={t.cart.title}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
