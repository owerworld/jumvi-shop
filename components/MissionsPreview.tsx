import content from "@/lib/content";

export default function MissionsPreview() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="title-md">Gorevlerden ornekler</h2>
            <p className="body-sm">Kutunun icindeki oyunlardan kisa bir tadim.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.missions.map((mission) => (
            <div key={mission.title} className="card p-5">
              <span className="mb-3 inline-flex h-2 w-10 rounded-full bg-brand-green/40" />
              <h3 className="text-lg font-semibold">{mission.title}</h3>
              <p className="body-sm">{mission.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
