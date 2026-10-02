'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { LEARNING_PATH } from '@/shared/config/routes';
import { useLocalePath, useT } from '@/shared/i18n';
import { cn } from '@/shared/lib';
import { gsap, ScrollTrigger, useGSAP } from '@/shared/lib/gsap';
import { Circles, SectionLabel } from '@/shared/ui';

const STEP_NUMERALS = ['๑', '๒', '๓', '๔'];

/** Lộ trình: bốn tít khổng lồ xếp dọc, tít nào đi qua giữa màn hình thì chuyển từ xám kem sang mực; bốn vòng tròn cam bên cạnh đặc dần theo chặng đang xem. */
export function LearningPathSection() {
  const t = useT();
  const href = useLocalePath();
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.path-row', root.current).forEach((row, i) => {
          ScrollTrigger.create({ trigger: row, start: 'top 58%', end: 'bottom 58%', onToggle: (self) => self.isActive && setActive(i) });
        });
        gsap.from('.path-row', { opacity: 0, y: 40, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.path-list', start: 'top 80%', once: true } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="path-title" className="scroll-mt-14">
      <div className="page-container py-20 md:py-32">
        <h2 id="path-title">
          <SectionLabel>{t.home.pathTitle}</SectionLabel>
        </h2>
        <p className="mt-4 max-w-[52ch] text-lg leading-snug text-ink-soft">{t.home.pathBlurb}</p>
        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <ol className="path-list lg:col-span-8">
            {LEARNING_PATH.map((p, i) => (
              <li key={p.href} className="path-row border-t-2 border-pastel last:border-b-2">
                <Link href={href(p.href)} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 py-6 focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-ink md:gap-8 md:py-10">
                  <span lang="th" aria-hidden className="w-[1.2em] font-thai text-4xl leading-none text-ink-soft md:text-6xl">
                    {STEP_NUMERALS[p.step - 1]}
                  </span>
                  <span className="min-w-0">
                    <span className={cn('block font-poster text-[clamp(2.75rem,7vw,6.5rem)] font-extrabold uppercase leading-[1] pb-[0.06em] transition-colors duration-300', active === i ? 'text-pastel' : 'text-note-taupe')}>{t.routes[p.key].title}</span>
                    <span className="mt-3 block max-w-[46ch] text-base leading-snug text-ink-soft md:text-lg">{t.routes[p.key].blurb}</span>
                  </span>
                  <span aria-hidden className="font-poster text-5xl leading-none transition-transform duration-300 group-hover:translate-x-2">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <div className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-28">
              <Circles active={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
