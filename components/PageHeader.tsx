import Link from "next/link";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  ctaDisabled?: boolean;
};

export default function PageHeader({ title, subtitle, ctaLabel, ctaHref, ctaDisabled }: PageHeaderProps) {
  return (
    <section className="section-pad gradient-bg">
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <h1 className="title-lg">{title}</h1>
        {subtitle ? <p className="max-w-2xl body-sm">{subtitle}</p> : null}
        {ctaLabel && ctaHref && !ctaDisabled ? (
          <Link href={ctaHref} className="btn-primary w-fit">
            {ctaLabel}
          </Link>
        ) : null}
        {ctaLabel && ctaDisabled ? (
          <button type="button" className="btn-primary w-fit cursor-not-allowed opacity-60" disabled>
            {ctaLabel}
          </button>
        ) : null}
      </div>
    </section>
  );
}
