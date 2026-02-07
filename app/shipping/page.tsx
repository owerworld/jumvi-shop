import { t } from "@/lib/i18n";

export default function ShippingPage() {
  return (
    <main className="section-pad">
      <div className="mx-auto max-w-3xl space-y-4">
        <h1 className="title-lg text-[color:var(--text)]">{t.policies.shipping.title}</h1>
        <p className="body-sm">{t.policies.shipping.body}</p>
      </div>
    </main>
  );
}
