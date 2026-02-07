import Image from "next/image";
import content from "@/lib/content";

export default function InsideBox() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-6xl space-y-10">
        <div>
          <h2 className="title-md">Kutudan neler cikiyor</h2>
          <p className="body-sm">Aninda oyuna baslamak icin hepsi bir arada.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {content.insideBox.map((item) => (
              <div key={item.title} className="card p-5">
                <div className="mb-4 h-10 w-10 rounded-full bg-brand-blue/20 ring-1 ring-black/5" />
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="body-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="card flex h-full items-center justify-center p-6">
            <div className="relative h-72 w-full overflow-hidden rounded-xl2 bg-white/70">
              <Image
                src="/whatisinside.png"
                alt="JUMVI kutu icerigi"
                fill
                sizes="(max-width: 1024px) 90vw, 480px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
