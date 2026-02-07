import content from "@/lib/content";

export default function FAQ() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h2 className="title-md">Sik sorulan sorular</h2>
          <p className="body-sm">Kisa ve net yanitlar.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {content.faq.map((item) => (
            <details key={item.q} className="card p-5">
              <summary className="cursor-pointer text-sm font-semibold text-brand-ink">
                {item.q}
              </summary>
              <p className="mt-2 body-sm">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
