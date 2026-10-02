'use client';
import { useRef } from 'react';
import { HeroMerge } from '@/widgets/hero-merge';
import { useLocalePath, useT } from '@/shared/i18n';
import { gsap, useGSAP } from '@/shared/lib/gsap';
import { Asterisk, SplitWords, Tape } from '@/shared/ui';

/** Mở đầu: tít condensed khổng lồ trồi lên từng từ, tờ giấy ghép ค่ะ bên phải, hàng dưới có lời dẫn và hai nút. Tất cả trên nền giấy. */
export function HeroSection() {
  const t = useT();
  const href = useLocalePath();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.sw', { yPercent: 115, duration: 1, stagger: 0.07, ease: 'expo.out', delay: 0.15 });
        gsap.from('.hero-fade', { opacity: 0, y: 24, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.7 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="page-container relative flex min-h-[calc(100svh-3.5rem)] flex-col justify-between gap-10 py-8 md:py-12">
      <p className="hero-fade flex items-center gap-2 font-poster text-xl font-bold uppercase leading-none">
        <Asterisk className="text-note-orange" />
        <span lang="th" className="font-thai">
          น่ารักไทย
        </span>{' '}
        · NarakThai
      </p>

      <div className="grid items-end gap-10 lg:grid-cols-12">
        <h1 className="text-balance font-poster text-pastel text-[clamp(3.5rem,9.5vw,9rem)] font-extrabold uppercase leading-[0.9] lg:col-span-8">
          <SplitWords text={t.home.headline} />
        </h1>
        <div className="hero-fade border-2 border-pastel lg:col-span-4">
          <div className="note-paper !border-0 px-4 pb-8 pt-10 md:px-6">
            <HeroMerge />
          </div>
        </div>
      </div>

      <div className="hero-fade flex flex-wrap items-end justify-between gap-6 border-t-2 border-pastel pt-6">
        <div className="max-w-[48ch] space-y-2">
          <p className="text-lg leading-snug md:text-xl">{t.home.body}</p>
          <p className="text-sm leading-relaxed text-ink-soft">
            <span lang="th" className="font-thai">
              “น่ารัก”
            </span>{' '}
            {t.home.tagline}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 pr-2">
          {/* Băng keo dán: màu cam và xanh trời của nền áp phích, mỗi lần tải một kiểu cắt, hoạ tiết và góc nghiêng */}
          <Tape size="lg" href={href('/lab')} color="var(--color-note-orange)">
            {t.home.cta}
          </Tape>
          <Tape size="lg" href={href('/aksornthai')} color="var(--color-note-sky)">
            {t.home.ctaSecondary}
          </Tape>
        </div>
      </div>
    </section>
  );
}
