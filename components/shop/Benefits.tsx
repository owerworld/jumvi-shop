export default function Benefits() {
  const items = [
    {
      title: "Refleks & Koordinasyon",
      desc: "At-yakala oyunuyla el-göz koordinasyonunu destekler.",
    },
    {
      title: "Ekransız Hareket",
      desc: "Çocukları ekrandan uzaklaştırır, hareket etmeye teşvik eder.",
    },
    {
      title: "Hemen Oyna",
      desc: "Kutudan çıkar, oyna - kurulum gerekmez.",
    },
  ];

  return (
    <section className="section-pad pt-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="title-md text-[color:var(--text)]">Neden JUMVI?</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="surface rounded-2xl border border-black/5 p-5">
              <h3 className="text-lg font-semibold text-[color:var(--text)]">{item.title}</h3>
              <p className="body-sm mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
