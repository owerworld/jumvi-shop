import content from "@/lib/content";

export default function MissionsPreview() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Missions preview</h2>
            <p className="text-sm text-brand-ink/60">A taste of the playful challenges inside.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.missions.map((mission) => (
            <div key={mission.title} className="card p-5">
              <h3 className="text-lg font-semibold">{mission.title}</h3>
              <p className="text-sm text-brand-ink/60">{mission.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
