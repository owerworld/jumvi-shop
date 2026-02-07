import type { Metadata } from "next";
import FAQ from "@/components/FAQ";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "JUMVI | FAQ",
  description: "Answers about the JUMVI play kit, shipping, and safety.",
};

export default function FaqPage() {
  return (
    <div>
      <PageHeader
        title="Frequently asked questions"
        subtitle="Everything you need to know before your first mission."
        ctaLabel="Buy now"
        ctaHref="/product"
      />
      <FAQ />
    </div>
  );
}
