import { t } from "@/lib/i18n";

export default function SocialProof() {
  return (
    <section className="section-pad pt-8">
      <div className="mx-auto max-w-6xl rounded-2xl border border-black/5 bg-[color:var(--surface)] px-5 py-4 text-sm text-[color:var(--muted)]">
        <span className="font-semibold text-[color:var(--text)]">{t.socialProof.highlight}</span>
        <span className="mx-2">•</span>
        <span>{t.socialProof.copy}</span>
      </div>
    </section>
  );
}
