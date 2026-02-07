export default function Testimonials() {
  const items = [
    {
      name: "Seda",
      text: "Kalite hissi çok iyi. Çocuklar her gün oynamak istiyor.",
    },
    {
      name: "Murat",
      text: "Ekransız hareket için harika. Hediye olarak da çok şık.",
    },
  ];

  return (
    <section className="section-pad pt-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="title-md text-[color:var(--text)]">Aileler ne diyor?</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.name} className="surface rounded-2xl border border-black/5 p-5">
              <div className="text-sm text-brand-orange">★★★★★</div>
              <p className="body-sm mt-3">“{item.text}”</p>
              <p className="mt-4 text-xs font-semibold text-[color:var(--text)]">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
