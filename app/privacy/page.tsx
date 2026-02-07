import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "JUMVI | Privacy",
  description: "Privacy policy for JUMVI.",
};

export default function PrivacyPage() {
  return (
    <div>
      <PageHeader title="Privacy" subtitle="We respect your privacy and protect your data." />
      <section className="section-pad">
        <div className="mx-auto max-w-3xl space-y-4 text-sm text-brand-ink/70">
          <p>
            We collect only the information needed to process orders and improve the JUMVI experience. We never sell personal data.
          </p>
          <p>
            For questions or data requests, contact us at support@jumvi.com.
          </p>
        </div>
      </section>
    </div>
  );
}
