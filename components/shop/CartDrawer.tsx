import { useEffect } from "react";
import { product } from "@/lib/product";

type CartDrawerProps = {
  open: boolean;
  qty: number;
  onClose: () => void;
  onQtyChange: (next: number) => void;
};

export default function CartDrawer({ open, qty, onClose, onQtyChange }: CartDrawerProps) {
  const subtotal = product.price * qty;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (open) {
      window.addEventListener("keydown", onKey);
    }
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const isEmpty = qty <= 0;

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-black/30" aria-label="Kapat" onClick={onClose} />
      <aside className="glass glass-surface absolute right-4 top-4 h-[calc(100%-2rem)] w-[min(420px,95vw)] rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[color:var(--text)]">Sepet</h3>
          <button type="button" className="text-sm text-[color:var(--muted)]" onClick={onClose}>
            Kapat
          </button>
        </div>
        {isEmpty ? (
          <div className="mt-6 rounded-2xl bg-white/70 p-6 text-center">
            <p className="text-sm font-semibold text-[color:var(--text)]">Sepetiniz boş</p>
            <p className="mt-2 text-xs text-[color:var(--muted)]">Ürünü sepete ekleyerek devam edebilirsiniz.</p>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl bg-white/70 p-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 overflow-hidden rounded-xl2 border border-black/10 bg-white/80">
                <img src="/jumvi-hero.png" alt="JUMVI ürün görseli" className="h-full w-full object-contain" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-[color:var(--text)]">JUMVI Toss & Catch Set</div>
                <div className="mt-1 text-xs text-[color:var(--muted)]">${product.price}</div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-[color:var(--muted)]">
              <span>Adet</span>
              <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-2 py-1">
                <button
                  type="button"
                  className="focus-ring h-6 w-6 rounded-full text-[color:var(--text)]"
                  onClick={() => onQtyChange(Math.max(0, qty - 1))}
                  aria-label="Azalt"
                >
                  -
                </button>
                <span className="min-w-[16px] text-center text-xs font-semibold text-[color:var(--text)]">{qty}</span>
                <button
                  type="button"
                  className="focus-ring h-6 w-6 rounded-full text-[color:var(--text)]"
                  onClick={() => onQtyChange(qty + 1)}
                  aria-label="Artır"
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
              <span className="text-[color:var(--muted)]">Ara toplam</span>
              <span className="font-semibold text-[color:var(--text)]">${subtotal}</span>
            </div>
            <div className="mt-6">
              <div className="h-2 rounded-full bg-white/60">
                <div className="h-2 w-2/3 rounded-full bg-brand-green" />
              </div>
              <p className="mt-2 text-xs text-[color:var(--muted)]">Ücretsiz kargo için $80 hedefi.</p>
            </div>
            <button type="button" className="btn-primary mt-6 w-full rounded-[18px] py-3 text-sm">
              Checkout
            </button>
            <p className="mt-3 text-xs text-[color:var(--muted)]">Güvenli ödeme sayfasına yönlendirilirsiniz.</p>
          </>
        ) : (
          <button type="button" className="btn-primary mt-6 w-full rounded-[18px] py-3 text-sm" onClick={onClose}>
            Alışverişe dön
          </button>
        )}
      </aside>
    </div>
  );
}
