import Link from "next/link";
import { t } from "@/lib/i18n";

export default function PolicyFooterLinks() {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-[color:var(--muted)]">
      <Link href="/shipping" className="underline">{t.footer.links.shipping}</Link>
      <Link href="/returns" className="underline">{t.footer.links.returns}</Link>
      <Link href="/privacy" className="underline">{t.footer.links.privacy}</Link>
      <Link href="/terms" className="underline">{t.footer.links.terms}</Link>
      <Link href="/contact" className="underline">{t.footer.links.contact}</Link>
    </div>
  );
}
