'use client';
import Link from 'next/link';
import { BANGKOK_FULL_NAME, BANGKOK_MARQUEE_CSS } from '@/shared/config/fonts';
import { useLocalePath, useT } from '@/shared/i18n';

/** Mỗi hàng một font, cỡ chữ và khoảng cách trên riêng (cố ý lệch nhau cho có nhịp to nhỏ). */
const MARQUEE_ROWS = [
  { family: 'Kanit', size: 'text-3xl md:text-5xl', gap: 'mt-0' },
  { family: 'Charm', size: 'text-6xl md:text-9xl', gap: 'mt-2 md:mt-1' },
  { family: 'Noto Sans Thai Looped', size: 'text-2xl md:text-3xl', gap: 'mt-6 md:mt-14' },
  { family: 'Playpen Sans Thai', size: 'text-5xl md:text-7xl', gap: 'mt-1' },
  { family: 'Mali', size: 'text-xl md:text-2xl', gap: 'mt-8 md:mt-20' },
  { family: 'Pridi', size: 'text-4xl md:text-8xl', gap: 'mt-3 md:mt-2' },
];

export function FooterCtaSection() {
  const t = useT();
  const href = useLocalePath();
  return (
    <section className="screen relative overflow-hidden">
      {/* React 19 đưa stylesheet lên <head> */}
      <link rel="stylesheet" href={BANGKOK_MARQUEE_CSS} precedence="default" />
      <div aria-hidden className="marquee-fade pointer-events-none absolute inset-0 flex select-none flex-col justify-center opacity-[0.16]">
        {MARQUEE_ROWS.map((r, i) => (
          <div lang="th" key={r.family} className={`overflow-hidden whitespace-nowrap leading-tight ${r.size} ${r.gap}`} style={{ fontFamily: `"${r.family}", var(--font-thai)` }}>
            <div className={`marquee-track ${i % 2 ? 'marquee-right' : 'marquee-left'}`} style={{ animationDuration: `${60 + i * 9}s` }}>
              {[0, 1].map((k) => (
                <span key={k} className="pr-16">
                  {BANGKOK_FULL_NAME}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="page-container relative w-full py-14 md:py-16">
        <div data-tape className="note-paper mx-auto max-w-3xl rounded-3xl px-6 py-14 text-center md:py-20">
          <h2 className="text-3xl font-semibold md:text-5xl">{t.home.footerTitle}</h2>
          <p className="mx-auto mt-4 max-w-md text-ink-soft md:text-lg">{t.home.footerBody}</p>
          <Link href={href('/lab')} className="btn btn-primary btn-hero mt-8">
            {t.home.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
