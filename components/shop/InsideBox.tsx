import Image from "next/image";
import { product } from "@/lib/product";

const contentItems = [
  { key: "paddles", label: "Paddle" },
  { key: "balls", label: "Soft Top" },
  { key: "meshBag", label: "Mesh Taşıma Çantası" },
  { key: "qrCard", label: "QR Görev Kartı" },
  { key: "giftBox", label: "Premium Hediye Kutusu" },
] as const;

type ContentKey = (typeof contentItems)[number]["key"];

export default function InsideBox() {
  return (
    <section id="inside" className="section-pad pt-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="title-md text-[color:var(--text)]">Kutunun içinde</h2>
        <p className="body-sm mt-2">Oynamak için ihtiyacınız olan her şey kutunun içinde.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-3">
            {contentItems.map((item) => (
              <div key={item.key} className="surface rounded-2xl border border-black/5 px-4 py-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-[color:var(--text)]">
                    {product.contents[item.key as ContentKey]} adet {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="surface rounded-2xl border border-black/5 p-5">
            <div className="relative h-72 w-full overflow-hidden rounded-xl2 bg-white/80">
              <Image
                src="/whatisinside.png"
                alt="Kutunun içinde bulunan parçalar"
                fill
                sizes="(max-width: 1024px) 90vw, 420px"
                className="object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
