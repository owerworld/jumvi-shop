import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "JUMVI | Shipping & Returns",
  description: "Shipping timelines, returns, and exchanges.",
};

export default function ShippingReturnsPage() {
  return (
    <div>
      <PageHeader
        title="Shipping & Returns"
        subtitle="Fast delivery, simple returns, and friendly support."
        ctaLabel="Buy now"
        ctaHref="/product"
      />
      <section className="section-pad">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h2 className="text-lg font-semibold">Shipping</h2>
            <p className="mt-2 text-sm text-brand-ink/60">
              Orders ship within 1-2 business days. Standard delivery is 3-5 business days.
            </p>
            <ul className="mt-4 grid gap-2 text-sm text-brand-ink/70">
              <li>Free shipping over $50</li>
              <li>Tracking included on every order</li>
              <li>Gift-ready packaging</li>
            </ul>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold">Returns</h2>
            <p className="mt-2 text-sm text-brand-ink/60">
              Try JUMVI for 30 days. If it's not a fit, return for a full refund.
            </p>
            <ul className="mt-4 grid gap-2 text-sm text-brand-ink/70">
              <li>30-day return window</li>
              <li>No questions asked</li>
              <li>Email support for quick help</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
