export default function TrustBar() {
  const items = ["30 gün iade", "Hızlı gönderim", "Güvenli ödeme"];

  return (
    <section className="section-pad pt-6">
      <div className="mx-auto grid max-w-6xl gap-3 rounded-2xl border border-black/5 bg-[color:var(--surface)] px-6 py-4 text-sm text-[color:var(--muted)] sm:grid-cols-3">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-2 font-semibold text-[color:var(--text)]">
            <span className="h-2 w-2 rounded-full bg-brand-green" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
