import { t } from "@/lib/i18n";

export default function ContactPage() {
  return (
    <main className="section-pad">
      <div className="mx-auto max-w-3xl space-y-4">
        <h1 className="title-lg text-[color:var(--text)]">{t.policies.contact.title}</h1>
        <p className="body-sm">{t.policies.contact.body}</p>
      </div>
    </main>
  );
}
