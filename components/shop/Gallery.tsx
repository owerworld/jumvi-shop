"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { t } from "@/lib/i18n";

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  type?: "image" | "video";
};

type GalleryProps = {
  items: GalleryItem[];
  onOpen: (index: number) => void;
};

export default function Gallery({ items, onOpen }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = useMemo(() => items[activeIndex], [items, activeIndex]);

  return (
    <div className="space-y-4">
      <button
        type="button"
        className="relative flex h-[320px] w-full items-center justify-center overflow-hidden rounded-2xl bg-white/70"
        onClick={() => onOpen(activeIndex)}
        aria-label={t.gallery.zoom}
      >
        {active.type === "video" ? (
          <div className="flex h-full w-full items-center justify-center text-sm text-[color:var(--muted)]">
            {t.gallery.videoPreview}
            <span className="ml-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-xs font-semibold">
              ▶
            </span>
          </div>
        ) : (
          <Image
            src={active.src}
            alt={active.alt}
            fill
            sizes="(max-width: 1024px) 90vw, 480px"
            className="object-contain"
            priority={activeIndex === 0}
          />
        )}
      </button>
      <div className="grid grid-cols-4 gap-2">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`relative h-16 w-full overflow-hidden rounded-xl2 border ${
              index === activeIndex ? "border-brand-blue" : "border-black/10"
            } bg-white/70`}
            aria-label={`${t.gallery.select} ${index + 1}`}
          >
            {item.type === "video" ? (
              <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-[color:var(--muted)]">
                {t.gallery.video}
              </div>
            ) : (
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="64px"
                className="object-contain"
                loading="lazy"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
