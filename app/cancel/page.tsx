import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "JUMVI | Checkout Canceled",
  description: "Your checkout was canceled.",
};

export default function CancelPage() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Checkout canceled</h1>
        <p className="text-sm text-brand-ink/60">
          No worries. You can return anytime to complete your order.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/product" className="btn-primary">
            Try again
          </Link>
          <Link href="/" className="btn-secondary">
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}
