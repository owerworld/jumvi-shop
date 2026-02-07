import type { Metadata } from "next";
import Image from "next/image";
import BuyButton from "@/components/BuyButton";
import content from "@/lib/content";

export const metadata: Metadata = {
  title: "JUMVI | Urun",
  description: "QR gorevleriyle premium aktif oyun kiti.",
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "JUMVI Oyun Kiti",
  description: "QR gorevleriyle premium aktif oyun kiti.",
  brand: { "@type": "Brand", name: "JUMVI" },
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    price: "59.00",
    availability: "https://schema.org/InStock"
  }
};

export default function ProductPage() {
  return (
    <div>
      <section className="section-pad gradient-bg">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              JUMVI Oyun Kiti
            </h1>
            <p className="body-sm">
              {content.brand.description}
            </p>
            <ul className="grid gap-3 text-sm text-brand-ink/70">
              <li>4 paddle, 4 top, file canta, QR kartlar</li>
              <li>3-8 yas icin tasarlandi</li>
              <li>Hediye hazir premium paket</li>
            </ul>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-semibold">$59</span>
              <span className="badge">$50 uzeri ucretsiz gonderim</span>
            </div>
          </div>
          <div className="card p-6">
            <div className="relative h-60 overflow-hidden rounded-xl2 bg-white/70">
              <Image
                src="/jumvi-hero.png"
                alt="JUMVI oyun kiti kutu ve paddle seti"
                fill
                sizes="(max-width: 1024px) 90vw, 420px"
                className="object-contain"
                loading="lazy"
              />
            </div>
            <div className="mt-6 space-y-4">
              <BuyButton />
              <p className="text-xs text-brand-ink/60">Satin alma yakinda.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section-pad pt-0">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {[
            { title: "Hafif ve guvenli", desc: "Yumusak malzemeler ve yuvarlak kenarlar." },
            { title: "Ekran hafif oyun", desc: "QR ile baslat, ekransiz devam et." },
            { title: "Aile icin ideal", desc: "Oyun bulusmalari ve ev icin." },
          ].map((item) => (
            <div key={item.title} className="card p-5">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="body-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section-pad">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {content.insideBox.map((item) => (
            <div key={item.title} className="card p-5">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="body-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section-pad pt-0">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {[
            { title: "30 gun iade", desc: "Memnun kalmazsan kolay iade." },
            { title: "Guvenlik testli", desc: "Cocuklar icin guvenli malzeme." },
            { title: "3-8 yas arasi", desc: "Kolaydan zora ilerleyen gorevler." },
          ].map((item) => (
            <div key={item.title} className="card p-5">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="body-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
    </div>
  );
}
