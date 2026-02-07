"use client";

import { t } from "@/lib/i18n";

export default function StoryBlocks() {
  const blocks = [t.story.materials, t.story.skills, t.story.gift];

  return (
    <section className="section-pad cv-auto pt-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="title-md text-[color:var(--text)]">{t.story.title}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {blocks.map((block) => (
            <div key={block.title} className="surface rounded-2xl border border-black/5 p-5">
              <h3 className="text-lg font-semibold text-[color:var(--text)]">{block.title}</h3>
              <p className="body-sm mt-2">{block.body}</p>
              <ul className="mt-4 list-disc pl-4 text-xs text-[color:var(--muted)]">
                {block.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
