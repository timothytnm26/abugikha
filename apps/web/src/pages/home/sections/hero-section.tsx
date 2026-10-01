'use client';
import Link from 'next/link';
import { HeroMerge } from '@/widgets/hero-merge';
import { useLocalePath, useT } from '@/shared/i18n';

export function HeroSection() {
  const t = useT();
  const href = useLocalePath();
  return (
    <section className="screen relative flex-col justify-center">
      <div className="page-container relative grid items-center gap-10 py-10 md:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="max-w-2xl space-y-5 md:space-y-6">
          <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight md:text-6xl xl:text-7xl">{t.home.headline}</h1>
          <p className="max-w-xl text-base leading-relaxed text-ink/80 md:text-xl">{t.home.body}</p>
          <p className="text-sm leading-relaxed text-ink-soft">
            <span lang="th" className="font-thai">“น่ารัก”</span> {t.home.tagline}
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href={href('/lab')} className="btn btn-primary btn-hero">
              {t.home.cta}
            </Link>
            <Link href={href('/aksornthai')} className="btn btn-outline">
              {t.home.ctaSecondary}
            </Link>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-xl">
          <div data-tape data-fold className="note-paper relative rounded-3xl px-4 pb-10 pt-12 md:px-10 md:pb-14 md:pt-16">
            <HeroMerge />
          </div>
        </div>
      </div>
    </section>
  );
}
