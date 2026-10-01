'use client';
import Link from 'next/link';
import { HeroMerge } from '@/widgets/hero-merge';
import { useLocalePath, useT } from '@/shared/i18n';

export function HeroSection() {
  const t = useT();
  const href = useLocalePath();
  return (
    <section className="screen relative flex-col justify-center">
      <div className="page-container relative grid items-center gap-12 py-10 md:py-16 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        <div className="max-w-2xl space-y-6 md:space-y-7">
          <h1 className="text-balance text-5xl font-semibold leading-[1.04] tracking-[-0.035em] md:text-7xl xl:text-[5.25rem]">{t.home.headline}</h1>
          <p className="max-w-[46ch] text-base leading-relaxed text-ink/80 md:text-xl">{t.home.body}</p>
          <p className="max-w-[46ch] text-sm leading-relaxed text-ink-soft">
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
        {/* Tờ giấy tràn ra mép phải và hạ thấp hơn cột chữ, để bố cục không đối xứng */}
        <div className="relative mx-auto w-full max-w-xl lg:-mr-10 lg:max-w-none lg:translate-y-10 xl:-mr-20">
          <div data-tape data-fold className="note-paper relative rounded-l-3xl rounded-r-3xl px-4 pb-10 pt-12 md:px-12 md:pb-16 md:pt-20 lg:rounded-r-none">
            <HeroMerge />
          </div>
        </div>
      </div>
    </section>
  );
}
