'use client';
import Link from 'next/link';
import { HeroMerge } from '@/widgets/hero-merge';
import { useLocalePath, useT } from '@/shared/i18n';

/** Trang nhất kiểu báo: vạch đôi đầu trang, tít serif lớn bên trái, "ảnh" là tờ giấy ghi chú vuông góc ở bên phải. */
export function HeroSection() {
  const t = useT();
  const href = useLocalePath();
  return (
    <section className="screen relative flex-col justify-center">
      <div className="page-container relative py-8 md:py-12">
        <div className="grid items-end gap-10 border-t-4 border-double border-ink pt-8 lg:grid-cols-[1.25fr_1fr] lg:gap-14 lg:pt-12">
          <div className="max-w-3xl space-y-6 md:space-y-7">
            <h1 className="text-balance font-display text-5xl font-semibold leading-[1.02] tracking-[-0.025em] md:text-7xl xl:text-[5.5rem]">{t.home.headline}</h1>
            <p className="max-w-[46ch] text-base leading-relaxed text-ink/85 md:text-xl">{t.home.body}</p>
            <p className="max-w-[46ch] border-l-2 border-ink/40 pl-4 text-sm leading-relaxed text-ink-soft">
              <span lang="th" className="font-thai">“น่ารัก”</span> {t.home.tagline}
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link href={href('/lab')} className="btn btn-flat btn-primary">
                {t.home.cta}
              </Link>
              <Link href={href('/aksornthai')} className="btn btn-flat btn-outline">
                {t.home.ctaSecondary}
              </Link>
            </div>
          </div>
          <div className="note-paper rounded-none border-ink! px-4 pb-10 pt-12 shadow-none! md:px-10 md:pb-14 md:pt-16">
            <HeroMerge />
          </div>
        </div>
      </div>
    </section>
  );
}
