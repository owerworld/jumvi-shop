import content from "@/lib/content";

export default function HowItWorks() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h2 className="title-md">Nasil calisir</h2>
          <p className="body-sm">Uc adimda hareketli ogrenme.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {content.howItWorks.map((step, index) => (
            <div key={step.title} className="card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue/10 text-sm font-semibold text-brand-blue">
                  0{index + 1}
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
              </div>
              <p className="mt-3 body-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
