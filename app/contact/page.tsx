import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "JUMVI | Iletisim",
  description: "JUMVI ekibi ile iletisime gecin.",
};

export default function ContactPage() {
  return (
    <div>
      <PageHeader
        title="Iletisim"
        subtitle="Siparis, gorev ve destek icin buradayiz."
        ctaLabel="Satin al"
        ctaHref="/product"
        ctaDisabled
      />
      <section className="section-pad">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h2 className="text-lg font-semibold">E-posta</h2>
            <p className="mt-2 body-sm">support@jumvi.com</p>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold">WhatsApp</h2>
            <p className="mt-2 body-sm">+1 (555) 123-4567</p>
          </div>
        </div>
      </section>
    </div>
  );
}
