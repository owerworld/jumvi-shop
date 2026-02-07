import Link from "next/link";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export default function PageHeader({ title, subtitle, ctaLabel, ctaHref }: PageHeaderProps) {
  return (
    <section className="section-pad gradient-bg">
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        {subtitle ? <p className="max-w-2xl text-sm text-brand-ink/60">{subtitle}</p> : null}
        {ctaLabel && ctaHref ? (
          <Link href={ctaHref} className="btn-primary w-fit">
            {ctaLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
