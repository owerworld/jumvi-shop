import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "JUMVI | Contact",
  description: "Contact the JUMVI team.",
};

export default function ContactPage() {
  return (
    <div>
      <PageHeader
        title="Contact"
        subtitle="We're here to help with orders, missions, and support."
        ctaLabel="Buy now"
        ctaHref="/product"
      />
      <section className="section-pad">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h2 className="text-lg font-semibold">Email</h2>
            <p className="mt-2 text-sm text-brand-ink/60">support@jumvi.com</p>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold">WhatsApp</h2>
            <p className="mt-2 text-sm text-brand-ink/60">+1 (555) 123-4567</p>
          </div>
        </div>
      </section>
    </div>
  );
}
