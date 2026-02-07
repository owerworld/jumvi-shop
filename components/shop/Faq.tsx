import Link from "next/link";
import type { ReactNode } from "react";

type FaqItem = {
  q: string;
  a: ReactNode;
};

const faqs: FaqItem[] = [
  {
    q: "Ev içinde oynanır mı?",
    a: "Evet, soft toplar ev içi kullanım için uygundur.",
  },
  {
    q: "Kaç yaş için uygundur?",
    a: "3–8 yaş aralığı için önerilir.",
  },
  {
    q: "QR görevleri nasıl çalışır?",
    a: "QR kodu bir kez tarayın, görevleri ekrandan takip edin.",
  },
  {
    q: "Toplar güvenli mi?",
    a: "Yumuşak malzeme ve düşük hız için tasarlanmıştır.",
  },
  {
    q: "İade süreci nasıl?",
    a: (
      <span>
        Detaylar için <Link href="#destek" className="underline">Destek</Link> bölümüne bakın.
      </span>
    ),
  },
  {
    q: "Kargo ne kadar sürer?",
    a: (
      <span>
        Bölgeye göre değişebilir. Güncel bilgi için <Link href="#destek" className="underline">Destek</Link> bölümünü inceleyin.
      </span>
    ),
  },
];

export default function Faq() {
  return (
    <section id="faq" className="section-pad pt-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="title-md text-[color:var(--text)]">Sık sorulan sorular</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {faqs.map((item) => (
            <details key={item.q} className="surface rounded-2xl border border-black/5 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-[color:var(--text)]">
                {item.q}
              </summary>
              <p className="body-sm mt-2">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
