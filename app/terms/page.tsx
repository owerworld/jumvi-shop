import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "JUMVI | Terms",
  description: "Terms of service for JUMVI.",
};

export default function TermsPage() {
  return (
    <div>
      <PageHeader title="Terms" subtitle="Simple, transparent terms for every order." />
      <section className="section-pad">
        <div className="mx-auto max-w-3xl space-y-4 text-sm text-brand-ink/70">
          <p>
            By purchasing JUMVI, you agree to our standard terms including payment, shipping timelines, and return policies described on this site.
          </p>
          <p>
            Contact support@jumvi.com for any questions about these terms.
          </p>
        </div>
      </section>
    </div>
  );
}
