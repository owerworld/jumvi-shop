"use client";

import { useState } from "react";
import { product } from "@/lib/product";
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

export default function HomePage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [qty, setQty] = useState(1);

  const handleAddToCart = () => {
    setCartOpen(true);
    setQty((current) => (current < 1 ? 1 : current));
  };

  return (
    <div className="theme-root aurora min-h-screen">
      <Header cartCount={qty} onCartOpen={() => setCartOpen(true)} />
      <main id="urun" className="section-pad pt-10">
        <Hero onAddToCart={handleAddToCart} />
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
        <FinalCta price={product.price} onAddToCart={handleAddToCart} />
      </main>
      <Footer />
      <CartDrawer open={cartOpen} qty={qty} onClose={() => setCartOpen(false)} onQtyChange={setQty} />
    </div>
  );
}
