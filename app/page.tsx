"use client";

import { useEffect, useMemo, useState } from "react";
import { product } from "@/lib/product";
import { t } from "@/lib/i18n";
import { track } from "@/lib/analytics";
import Header from "@/components/shop/Header";
import Hero from "@/components/shop/Hero";
import TrustBar from "@/components/shop/TrustBar";
import Benefits from "@/components/shop/Benefits";
import SocialProof from "@/components/shop/SocialProof";
import HowItWorks from "@/components/shop/HowItWorks";
import InsideBox from "@/components/shop/InsideBox";
import SafePlay from "@/components/shop/SafePlay";
import Guarantee from "@/components/shop/Guarantee";
import Faq from "@/components/shop/Faq";
import Testimonials from "@/components/shop/Testimonials";
import PaymentMethods from "@/components/shop/PaymentMethods";
import FinalCta from "@/components/shop/FinalCta";
import CartDrawer from "@/components/shop/CartDrawer";
import Footer from "@/components/shop/Footer";
import StickyBuyBar from "@/components/shop/StickyBuyBar";
import Lightbox from "@/components/shop/Lightbox";
import type { GalleryItem } from "@/components/shop/Gallery";
import JsonLd from "@/components/shop/JsonLd";

const galleryItems: GalleryItem[] = [
  { id: "main", src: "/jumvi-hero.png", alt: t.images.heroAlt },
  { id: "box", src: "/whatisinside.png", alt: t.images.boxAlt },
  { id: "lifestyle", src: "/phoneqr.png", alt: t.images.lifestyleAlt },
  { id: "video", src: "/jumvi-hero.png", alt: t.images.videoAlt, type: "video" },
];

export default function HomePage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const lightboxItem = useMemo(() => (lightboxIndex === null ? undefined : galleryItems[lightboxIndex]), [lightboxIndex]);

  useEffect(() => {
    track("view_item", { item_name: t.hero.title, price: product.price });
  }, []);

  const handleAddToCart = () => {
    setCartOpen(true);
    setQty((current) => (current < 1 ? 1 : current));
    track("add_to_cart", { item_name: t.hero.title, price: product.price, quantity: 1 });
  };

  const handleCheckout = () => {
    track("begin_checkout", { value: product.price * qty, currency: "USD" });
  };

  return (
    <div className="theme-root aurora min-h-screen">
      <JsonLd />
      <Header cartCount={qty} onCartOpen={() => setCartOpen(true)} />
      <main id="urun" className="section-pad pt-10">
        <Hero
          onAddToCart={handleAddToCart}
          onOpenLightbox={(index) => setLightboxIndex(index)}
          galleryItems={galleryItems}
        />
        <TrustBar />
        <Benefits />
        <SocialProof />
        <HowItWorks />
        <InsideBox />
        <SafePlay />
        <Testimonials />
        <Guarantee />
        <Faq />
        <PaymentMethods />
        <FinalCta onAddToCart={handleAddToCart} />
      </main>
      <Footer />
      <StickyBuyBar price={product.price} rating={product.rating} onAddToCart={handleAddToCart} />
      <CartDrawer
        open={cartOpen}
        qty={qty}
        onClose={() => setCartOpen(false)}
        onQtyChange={setQty}
        onCheckout={handleCheckout}
      />
      <Lightbox open={lightboxIndex !== null} item={lightboxItem} onClose={() => setLightboxIndex(null)} />
    </div>
  );
}
