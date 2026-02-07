import Link from "next/link";

const links = [
  { href: "/product", label: "Urun" },
  { href: "/missions", label: "Gorevler" },
  { href: "/faq", label: "SSS" },
  { href: "/contact", label: "Iletisim" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          JUMVI
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-brand-ink/80 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-brand-ink">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="btn-primary cursor-not-allowed opacity-60"
            aria-label="Satin al yakinda"
            disabled
          >
            Satin al
          </button>
        </div>
      </div>
    </header>
  );
}
