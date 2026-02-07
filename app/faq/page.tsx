import type { Metadata } from "next";
import FAQ from "@/components/FAQ";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "JUMVI | SSS",
  description: "JUMVI oyun kiti, gonderim ve guvenlik hakkinda yanitlar.",
};

export default function FaqPage() {
  return (
    <div>
      <PageHeader
        title="Sik sorulan sorular"
        subtitle="Ilk gorevden once bilmeniz gerekenler."
        ctaLabel="Satin al"
        ctaHref="/product"
        ctaDisabled
      />
      <FAQ />
    </div>
  );
}
