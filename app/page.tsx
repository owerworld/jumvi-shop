import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import InsideBox from "@/components/InsideBox";
import HowItWorks from "@/components/HowItWorks";
import MissionsPreview from "@/components/MissionsPreview";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <InsideBox />
      <HowItWorks />
      <MissionsPreview />
      <Reviews />
      <FAQ />
    </>
  );
}
