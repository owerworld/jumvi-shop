"use client";

import Image from "next/image";
import { useEffect } from "react";
import { t } from "@/lib/i18n";
import type { GalleryItem } from "@/components/shop/Gallery";

type LightboxProps = {
  open: boolean;
  item?: GalleryItem;
  onClose: () => void;
};

export default function Lightbox({ open, item, onClose }: LightboxProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (open) {
      window.addEventListener("keydown", onKey);
    }
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-black/60" onClick={onClose} aria-label={t.gallery.close} />
      <div className="absolute left-1/2 top-1/2 w-[min(90vw,720px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-4">
        <div className="relative h-[70vh] w-full overflow-hidden rounded-2xl">
          {item.type === "video" ? (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">{t.gallery.videoPreview}</div>
          ) : (
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="90vw"
              className="object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}
