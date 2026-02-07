export default function SafePlay() {
  const rules = [
    "Yüz seviyesinin altına atın",
    "1–3 metre mesafede oynayın",
    "Ebeveyn gözetimi önerilir",
  ];

  return (
    <section className="section-pad pt-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="title-md text-[color:var(--text)]">Güvenli oyun</h2>
        <div className="mt-6 grid gap-3">
          {rules.map((rule) => (
            <div key={rule} className="surface rounded-2xl border border-black/5 px-4 py-3 text-sm text-[color:var(--muted)]">
              {rule}
            </div>
          ))}
        </div>
        <p className="body-sm mt-4">
          CPC / ASTM / CPSIA uyumluluk süreçleri planlanmaktadır.
        </p>
      </div>
    </section>
  );
}
