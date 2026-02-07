import type { Metadata } from "next";
import BuyButton from "@/components/BuyButton";
import content from "@/lib/content";

export const metadata: Metadata = {
  title: "JUMVI | Product",
  description: "A premium active play kit with QR missions.",
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "JUMVI Play Kit",
  description: "Premium active play kit with QR missions for kids.",
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
              JUMVI Play Kit
            </h1>
            <p className="text-sm text-brand-ink/60">
              {content.brand.description}
            </p>
            <ul className="grid gap-3 text-sm text-brand-ink/70">
              <li>Includes 4 paddles, 4 balls, mesh bag, QR missions</li>
              <li>Designed for ages 3-8</li>
              <li>Gift-ready premium packaging</li>
            </ul>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-semibold">$59</span>
              <span className="badge">Free shipping over $50</span>
            </div>
          </div>
          <div className="card p-6">
            <div className="h-52 rounded-xl2 bg-gradient-to-br from-brand-blue/20 via-white to-brand-green/20" />
            <div className="mt-6 space-y-4">
              <BuyButton />
              <p className="text-xs text-brand-ink/60">
                Secure checkout powered by Stripe. Ships in 1-2 business days.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="section-pad">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {content.insideBox.map((item) => (
            <div key={item.title} className="card p-5">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-brand-ink/60">{item.desc}</p>
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
