import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "JUMVI | Siparis Onaylandi",
  description: "Siparisiniz alindi.",
};

export default function SuccessPage() {
  return (
    <section className="section-pad gradient-bg">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <h1 className="title-lg">Siparis alindi</h1>
        <p className="body-sm">
          JUMVI'yi tercih ettigin icin tesekkurler. Gorevlerin yolda!
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/missions" className="btn-primary">
            Gorevleri kesfet
          </Link>
          <Link href="/" className="btn-secondary">
            Ana sayfa
          </Link>
        </div>
      </div>
    </section>
  );
}
