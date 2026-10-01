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
          <p className="hero-eyebrow">
            <svg aria-hidden viewBox="0 0 24 24" className="size-4 fill-tone-falling">
              <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 5 6.4 5c2 0 3.600 1.100 5.600 3.200C14 6.100 15.600 5 17.600 5c3.400 0 5.500 3.400 4 6.800C19.500 16.400 12 21 12 21z" />
            </svg>
            <span>
              <span lang="th" className="font-thai">น่ารักไทย</span> · {t.home.eyebrow}
            </span>
          </p>
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
          <div aria-hidden className="absolute inset-0 rotate-3 rounded-3xl bg-paper-deep shadow-md" />
          <div aria-hidden className="absolute inset-0 -rotate-2 rounded-3xl bg-tone-falling/15" />
          <div data-tape data-fold className="note-paper relative rounded-3xl px-4 pb-10 pt-12 md:px-10 md:pb-14 md:pt-16">
            <HeroMerge />
          </div>
        </div>
      </div>
    </section>
  );
}
