import type { Metadata } from "next";
import Link from "next/link";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "JUMVI | Order Confirmed",
  description: "Your JUMVI order is confirmed.",
};

export default function SuccessPage() {
  return (
    <section className="section-pad aurora">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <h1 className="title-lg">{t.status.success.title}</h1>
        <p className="body-sm">{t.status.success.body}</p>
        <div className="flex justify-center gap-3">
          <Link href="/" className="btn-primary">
            {t.status.success.primary}
          </Link>
          <Link href="/contact" className="btn-secondary">
            {t.status.success.secondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
