"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { product } from "@/lib/product";
import { t } from "@/lib/i18n";

type CartDrawerProps = {
  open: boolean;
  qty: number;
  onClose: () => void;
  onQtyChange: (next: number) => void;
  onCheckout: () => void;
};

export default function CartDrawer({ open, qty, onClose, onQtyChange, onCheckout }: CartDrawerProps) {
  const subtotal = product.price * qty;
  const freeShippingTarget = 80;
  const progress = Math.min(100, Math.round((subtotal / freeShippingTarget) * 100));
  const drawerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          last.focus();
          event.preventDefault();
        } else if (!event.shiftKey && document.activeElement === last) {
          first.focus();
          event.preventDefault();
        }
      }
    };
    if (open) {
      window.addEventListener("keydown", onKey);
      setTimeout(() => drawerRef.current?.querySelector<HTMLElement>("button")?.focus(), 0);
    }
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const isEmpty = qty <= 0;

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label={t.cart.title}>
      <button type="button" className="absolute inset-0 bg-black/30" aria-label={t.gallery.close} onClick={onClose} />
      <aside ref={drawerRef} className="glass glass-surface absolute right-4 top-4 h-[calc(100%-2rem)] w-[min(420px,95vw)] rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[color:var(--text)]">{t.cart.title}</h3>
          <button type="button" className="text-sm text-[color:var(--muted)]" onClick={onClose}>
            {t.cart.keepBrowsing}
          </button>
        </div>
        <p className="mt-2 text-xs text-[color:var(--muted)]">{t.cart.added}</p>
        {isEmpty ? (
          <div className="mt-6 rounded-2xl bg-white/70 p-6 text-center">
            <p className="text-sm font-semibold text-[color:var(--text)]">{t.cart.empty}</p>
            <p className="mt-2 text-xs text-[color:var(--muted)]">{t.cart.emptyNote}</p>
            <a href="#urun" className="mt-4 inline-flex text-xs font-semibold text-brand-blue underline">
              {t.sticky.cta}
            </a>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl bg-white/70 p-4">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-xl2 border border-black/10 bg-white/80">
                <Image
                  src="/jumvi-hero.png"
                  alt="JUMVI product"
                  fill
                  sizes="56px"
                  className="object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-[color:var(--text)]">{t.hero.title}</div>
                <div className="mt-1 text-xs text-[color:var(--muted)]">${product.price}</div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-[color:var(--muted)]">
              <span>{t.cart.qty}</span>
              <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-2 py-1">
                <button
                  type="button"
                  className="focus-ring h-6 w-6 rounded-full text-[color:var(--text)]"
                  onClick={() => onQtyChange(Math.max(0, qty - 1))}
                  aria-label={t.cart.decrease}
                >
                  -
                </button>
                <span className="min-w-[16px] text-center text-xs font-semibold text-[color:var(--text)]">{qty}</span>
                <button
                  type="button"
                  className="focus-ring h-6 w-6 rounded-full text-[color:var(--text)]"
                  onClick={() => onQtyChange(qty + 1)}
                  aria-label={t.cart.increase}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
        {!isEmpty ? (
          <>
            <div className="mt-6 flex items-center justify-between text-sm">
              <span className="text-[color:var(--muted)]">{t.cart.subtotal}</span>
              <span className="font-semibold text-[color:var(--text)]">${subtotal}</span>
            </div>
            <div className="mt-4 space-y-2 text-xs text-[color:var(--muted)]">
              <div>{t.cart.delivery}</div>
              <div>{t.cart.returns}</div>
              <div>{t.cart.secure}</div>
            </div>
            <div className="mt-4">
              <div className="h-2 rounded-full bg-white/60">
                <div className="h-2 rounded-full bg-brand-green" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-xs text-[color:var(--muted)]">
                {t.cart.freeShippingOver} ({progress}%)
              </p>
            </div>
            <div className="mt-4 grid gap-2">
              <button
                type="button"
                className="btn-primary w-full rounded-[18px] py-3 text-sm"
                aria-label="Begin checkout"
                onClick={onCheckout}
              >
                {t.cart.checkout}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" className="surface rounded-[14px] border border-black/10 py-2 text-xs text-[color:var(--muted)]" disabled>
                  Apple Pay
                </button>
                <button type="button" className="surface rounded-[14px] border border-black/10 py-2 text-xs text-[color:var(--muted)]" disabled>
                  Google Pay
                </button>
              </div>
            </div>
          </>
        ) : (
          <button type="button" className="btn-primary mt-6 w-full rounded-[18px] py-3 text-sm" onClick={onClose}>
            {t.cart.keepBrowsing}
          </button>
        )}
      </aside>
    </div>
  );
}
