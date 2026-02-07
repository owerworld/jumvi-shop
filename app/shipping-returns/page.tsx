import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "JUMVI | Gonderim ve Iade",
  description: "Gonderim sureleri, iade ve degisim.",
};

export default function ShippingReturnsPage() {
  return (
    <div>
      <PageHeader
        title="Gonderim ve Iade"
        subtitle="Hizli teslimat, kolay iade, destek her zaman yaninizda."
        ctaLabel="Satin al"
        ctaHref="/product"
        ctaDisabled
      />
      <section className="section-pad">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h2 className="text-lg font-semibold">Gonderim</h2>
            <p className="mt-2 body-sm">
              Siparisler 1-2 is gununde kargoya verilir. Standart teslimat 3-5 is gunudur.
            </p>
            <ul className="mt-4 grid gap-2 text-sm text-brand-ink/70">
              <li>$50 uzeri ucretsiz gonderim</li>
              <li>Takip numarasi her sipariste</li>
              <li>Hediye hazir paketleme</li>
            </ul>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold">Iade</h2>
            <p className="mt-2 body-sm">
              JUMVI'yi 30 gun deneyin. Uygun degilse, tam iade.
            </p>
            <ul className="mt-4 grid gap-2 text-sm text-brand-ink/70">
              <li>30 gun iade suresi</li>
              <li>Kolay ve hizli surec</li>
              <li>E-posta destegi</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
