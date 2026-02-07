import Link from "next/link";
import content from "@/lib/content";

const legalLinks = [
  { href: "/privacy", label: "Gizlilik" },
  { href: "/terms", label: "Kosullar" },
  { href: "/shipping-returns", label: "Gonderim ve Iade" },
];

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 sm:px-10 md:grid-cols-2">
        <div className="space-y-3">
          <div className="text-lg font-semibold">JUMVI</div>
          <p className="body-sm">
            Cocuklar icin premium oyun gorevleri. Hareket ve ogrenmeyi bir araya getirir.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-brand-ink/70">Yasal</p>
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block text-brand-ink/60 hover:text-brand-ink">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-brand-ink/70">Sosyal</p>
            {content.footer.social.map((item) => (
              <a key={item} href="#" className="block text-brand-ink/60 hover:text-brand-ink" aria-disabled="true">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-black/5 py-4 text-center text-xs text-brand-ink/50">
        (c) {new Date().getFullYear()} JUMVI. All rights reserved.
      </div>
    </footer>
  );
}
