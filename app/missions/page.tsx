import type { Metadata } from "next";
import Image from "next/image";
import MissionsPreview from "@/components/MissionsPreview";
import PageHeader from "@/components/PageHeader";
import content from "@/lib/content";

export const metadata: Metadata = {
  title: "JUMVI | Gorevler",
  description: "QR gorevleriyle oyun zamanini ogrenmeye cevir.",
};

export default function MissionsPage() {
  return (
    <div>
      <PageHeader
        title="QR Gorev Sistemi"
        subtitle="Kutudaki QR karti bir kez tara. Sonra ekransiz, hareketli ve keyifli gorevler acilsin."
        ctaLabel="Satin al"
        ctaHref="/product"
        ctaDisabled
      />
      <section className="section-pad">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h2 className="text-xl font-semibold">Sistem nasil calisir</h2>
            <p className="mt-2 body-sm">
              Her kartta bir QR kod var. Bir kez tara, sonra rehberle ekransiz oyna. Gorevler kisa, net ve hareket odakli.
            </p>
            <div className="mt-4">
              <a
                href="https://qr.jumvi.co"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                QR gorevlerini ac
              </a>
            </div>
            <ul className="mt-4 grid gap-2 text-sm text-brand-ink/70">
              <li>Hareket, dikkat ve hafiza dengesi</li>
              <li>3-8 yas icin kolay zorluk</li>
              <li>Oyun bulusmalari ve siniflar icin ideal</li>
            </ul>
          </div>
          <div className="card flex items-center justify-center p-6">
            <div className="relative h-80 w-full overflow-hidden rounded-xl2 bg-white/70">
              <Image
                src="/phoneqr.png"
                alt="Telefon ekraninda JUMVI gorevleri"
                fill
                sizes="(max-width: 1024px) 90vw, 480px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="section-pad pt-0">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h2 className="text-xl font-semibold">Cocuklar ne kazanir</h2>
            <p className="mt-2 body-sm">
              Gorevler koordinasyon, ritim, problem cozme ve ozguveni guclendirir.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "Denge",
                "Ritim",
                "Renkler",
                "Takim",
                "Dinleme",
                "Oz kontrol",
              ].map((item) => (
                <span key={item} className="badge">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-semibold">QR gorev akisi</h2>
            <p className="mt-2 body-sm">
              Mobil ekran rehberidir. Tarama sonrasi adim adim yonlendirir.
            </p>
            <div className="mt-4 grid gap-3 text-sm text-brand-ink/70">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-brand-blue/60" />
                <span>Kolay baslangic ve hizli kurulum</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-brand-green/60" />
                <span>Gorevler kisa ve net adimlarla</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-brand-orange/60" />
                <span>Ekran hafif, hareket odakli</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section-pad pt-0">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {content.howItWorks.map((step, index) => (
            <div key={step.title} className="card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue/10 text-sm font-semibold text-brand-blue">
                  0{index + 1}
                </div>
                <div className="text-sm font-semibold text-brand-ink">{step.title}</div>
              </div>
              <p className="mt-3 body-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <MissionsPreview />
      <section className="section-pad">
        <div className="mx-auto max-w-6xl rounded-xl2 border border-black/5 bg-brand-mist p-6">
          <h3 className="text-lg font-semibold">Daha fazlasini ister misin?</h3>
          <p className="body-sm">
            Tam kutuda {content.missions.length * 2}+ gorev var. Yeni sezonluk gorevler e-posta ile gelir.
          </p>
        </div>
      </section>
    </div>
  );
}
