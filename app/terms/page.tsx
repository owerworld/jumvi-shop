import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "JUMVI | Kosullar",
  description: "JUMVI hizmet kosullari.",
};

export default function TermsPage() {
  return (
    <div>
      <PageHeader title="Kosullar" subtitle="Her siparis icin sade ve seffaf kosullar." />
      <section className="section-pad">
        <div className="mx-auto max-w-3xl space-y-4 text-sm text-brand-ink/70">
          <p>
            JUMVI satin aldiginizda, bu sitede belirtilen odeme, gonderim ve iade kosullarini kabul etmis olursunuz.
          </p>
          <p>
            Sorulariniz icin support@jumvi.com adresine yazabilirsiniz.
          </p>
        </div>
      </section>
    </div>
  );
}
