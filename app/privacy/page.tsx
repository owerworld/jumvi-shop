import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "JUMVI | Gizlilik",
  description: "JUMVI gizlilik politikasi.",
};

export default function PrivacyPage() {
  return (
    <div>
      <PageHeader title="Gizlilik" subtitle="Gizliliginize saygi duyar, verinizi koruruz." />
      <section className="section-pad">
        <div className="mx-auto max-w-3xl space-y-4 text-sm text-brand-ink/70">
          <p>
            Siparisleri islemek ve JUMVI deneyimini gelistirmek icin gereken minimum bilgiyi toplariz. Kisisel verileri asla satmayiz.
          </p>
          <p>
            Sorulariniz icin support@jumvi.com adresinden bize ulasabilirsiniz.
          </p>
        </div>
      </section>
    </div>
  );
}
