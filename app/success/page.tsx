import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "JUMVI | Order Success",
  description: "Your order is confirmed.",
};

export default function SuccessPage() {
  return (
    <section className="section-pad gradient-bg">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Order confirmed</h1>
        <p className="text-sm text-brand-ink/60">
          Thank you for choosing JUMVI. Your missions are on the way!
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/missions" className="btn-primary">
            Explore missions
          </Link>
          <Link href="/" className="btn-secondary">
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}
