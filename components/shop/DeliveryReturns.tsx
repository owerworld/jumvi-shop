import { t } from "@/lib/i18n";

export default function DeliveryReturns() {
  return (
    <div className="rounded-2xl border border-black/5 bg-[color:var(--surface)] px-4 py-3 text-xs text-[color:var(--muted)]">
      <div className="flex flex-wrap items-center gap-3">
        <span>{t.hero.delivery}</span>
        <span>•</span>
        <span>{t.hero.freeShipping}</span>
        <span>•</span>
        <span>{t.hero.returns}</span>
        <a href="#destek" className="underline">
          {t.hero.support}
        </a>
      </div>
    </div>
  );
}
