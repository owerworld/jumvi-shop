import { t } from "@/lib/i18n";
import PolicyFooterLinks from "@/components/shop/PolicyFooterLinks";

export default function Footer() {
  return (
    <footer id="destek" className="footer-safe cv-auto surface border-t border-black/5 px-6 py-10 text-center text-xs text-[color:var(--muted)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2">
        <span>{t.footer.brand}</span>
        <span>{t.footer.supportEmail}</span>
        <div className="mt-3 flex w-full max-w-sm items-center gap-2">
          <input
            type="email"
            placeholder={t.footer.newsletterPlaceholder}
            className="w-full rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs text-[color:var(--text)]"
          />
          <button type="button" className="btn-primary rounded-full px-4 py-2 text-xs">
            {t.footer.newsletter}
          </button>
        </div>
        <PolicyFooterLinks />
      </div>
    </footer>
  );
}
