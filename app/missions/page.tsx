import type { Metadata } from "next";
import MissionsPreview from "@/components/MissionsPreview";
import PageHeader from "@/components/PageHeader";
import content from "@/lib/content";

export const metadata: Metadata = {
  title: "JUMVI | Missions",
  description: "QR missions that turn playtime into learning time.",
};

export default function MissionsPage() {
  return (
    <div>
      <PageHeader
        title="QR Missions"
        subtitle="Scan the QR insert to unlock playful missions designed for movement, memory, and coordination."
        ctaLabel="Buy now"
        ctaHref="/product"
      />
      <section className="section-pad">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h2 className="text-xl font-semibold">How the system works</h2>
            <p className="mt-2 text-sm text-brand-ink/60">
              Each mission card includes a QR code. Scan once, then play screen-free with the guide. Missions are short, clear, and designed to keep kids moving.
            </p>
            <ul className="mt-4 grid gap-2 text-sm text-brand-ink/70">
              <li>Mix movement with memory and focus</li>
              <li>Easy difficulty for ages 3-8</li>
              <li>Perfect for playdates and classrooms</li>
            </ul>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-semibold">What kids learn</h2>
            <p className="mt-2 text-sm text-brand-ink/60">
              Missions encourage coordination, rhythm, problem-solving, and confidence.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "Balance",
                "Timing",
                "Colors",
                "Teamwork",
                "Listening",
                "Self-control",
              ].map((item) => (
                <span key={item} className="badge">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <MissionsPreview />
      <section className="section-pad">
        <div className="mx-auto max-w-6xl rounded-xl2 border border-black/5 bg-brand-mist p-6">
          <h3 className="text-lg font-semibold">Want the full set?</h3>
          <p className="text-sm text-brand-ink/60">
            Over {content.missions.length * 2}+ missions in the full library. New seasonal missions arrive by email.
          </p>
        </div>
      </section>
    </div>
  );
}
