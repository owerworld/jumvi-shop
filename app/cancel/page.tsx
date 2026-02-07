import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "JUMVI | Odeme Iptal",
  description: "Odeme islemi iptal edildi.",
};

export default function CancelPage() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <h1 className="title-lg">Odeme iptal edildi</h1>
        <p className="body-sm">
          Sorun degil. Diledigin zaman geri donup tamamlayabilirsin.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/product" className="btn-primary">
            Tekrar dene
          </Link>
          <Link href="/" className="btn-secondary">
            Ana sayfa
          </Link>
        </div>
      </div>
    </section>
  );
}
