import type { Metadata } from "next";
import Link from "next/link";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "JUMVI | Checkout Canceled",
  description: "Checkout was canceled.",
};

export default function CancelPage() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <h1 className="title-lg">{t.status.cancel.title}</h1>
        <p className="body-sm">{t.status.cancel.body}</p>
        <div className="flex justify-center gap-3">
          <Link href="/#urun" className="btn-primary">
            {t.status.cancel.primary}
          </Link>
          <Link href="/" className="btn-secondary">
            {t.status.cancel.secondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
