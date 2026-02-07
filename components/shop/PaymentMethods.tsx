import { t } from "@/lib/i18n";

export default function PaymentMethods() {
  const methods = ["Visa", "Mastercard", "Apple Pay", "Google Pay"];

  return (
    <section className="section-pad pt-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold text-[color:var(--muted)]">{t.payment.title}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {methods.map((item) => (
            <span key={item} className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-semibold text-[color:var(--text)]">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
