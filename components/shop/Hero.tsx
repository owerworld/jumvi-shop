import Image from "next/image";
import { product } from "@/lib/product";

type HeroProps = {
  onAddToCart: () => void;
};

export default function Hero({ onAddToCart }: HeroProps) {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <p className="eyebrow">JUMVI Shop</p>
        <h1 className="title-xl text-[color:var(--text)] leading-tight">JUMVI Toss & Catch Set</h1>
        <p className="body-md">
          3–8 yaş için güvenli, hareketli ve premium hediye-hazır oyun seti.
        </p>
        <div className="flex items-center gap-4 text-sm text-[color:var(--muted)]">
          <span className="text-3xl font-semibold text-[color:var(--text)]">${product.price}</span>
          <span>•</span>
          <span>{product.rating} ★ ({product.reviewCount} değerlendirme)</span>
        </div>
        <p className="text-xs text-[color:var(--muted)]">
          Kargo: $50 üzeri ücretsiz • 30 gün iade
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "Yumuşak Toplar",
            "Premium Hediye Kutusu",
            "QR Görevleri",
          ].map((badge) => (
            <span key={badge} className="badge">
              {badge}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-[color:var(--muted)]">
          <span className="rounded-full border border-black/5 bg-white/60 px-3 py-1">CPC/ASTM süreçleri planlanıyor</span>
          <span className="rounded-full border border-black/5 bg-white/60 px-3 py-1">Güvenli malzeme</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-primary rounded-[18px] px-6 py-3 text-sm" onClick={onAddToCart}>
            Sepete Ekle
          </button>
          <a href="#inside" className="btn-secondary rounded-[18px] px-6 py-3 text-sm">
            Kutunun İçinde
          </a>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-[color:var(--muted)]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-green" />
            <span>Hızlı gönderim</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-blue" />
            <span>Kolay iade</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-orange" />
            <span>Güvenli ödeme</span>
          </div>
        </div>
      </div>
      <div className="glass glass-surface relative rounded-[24px] p-5">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-blue/20 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-brand-green/20 blur-3xl" />
        <div className="relative flex h-full min-h-[300px] items-center justify-center rounded-2xl bg-white/70 p-5">
          <Image
            src="/jumvi-hero.png"
            alt="JUMVI Toss & Catch Set ürün görseli"
            width={520}
            height={520}
            className="h-auto w-full object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}
