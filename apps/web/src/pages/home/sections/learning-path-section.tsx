'use client';
import { useRef } from 'react';
import { LEARNING_PATH } from '@/shared/config/routes';
import { useLocalePath, useT } from '@/shared/i18n';
import { cn } from '@/shared/lib';
import { useTileReveal } from '@/shared/lib/use-tile-reveal';
import { Chevrons, PosterFrame, PosterHeading, PosterLink, type PosterBg } from '@/shared/ui';

const STEP_NUMERALS = ['๑', '๒', '๓', '๔'];

/** Mỗi chặng một ô màu có kích thước riêng; chặng cuối (ghép chữ) là ô lớn nhất vì đó là nơi người học thực sự làm việc. */
const STEPS: { bg: PosterBg; place: string; big?: boolean }[] = [
  { bg: 'blue', place: 'lg:col-span-3 lg:row-span-2' },
  { bg: 'orange', place: 'lg:col-span-3 lg:row-span-2' },
  { bg: 'violet', place: 'lg:col-span-2 lg:row-span-2' },
  { bg: 'lime', place: 'lg:col-span-4 lg:row-span-2', big: true },
];

export function LearningPathSection() {
  const t = useT();
  const href = useLocalePath();
  const root = useRef<HTMLDivElement>(null);
  useTileReveal(root);
  return (
    <section aria-labelledby="path-title" className="scroll-mt-14">
      <PosterHeading bg="black" id="path-title">{t.home.pathTitle}</PosterHeading>
      <div className="page-container py-6 md:py-8">
        <p className="max-w-[52ch] text-ink/85 md:text-lg">{t.home.pathBlurb}</p>
      </div>
      <PosterFrame ref={root}>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 lg:grid-rows-[repeat(4,minmax(4.5rem,auto))]">
            {LEARNING_PATH.map((p, i) => {
              const s = STEPS[i];
              return (
                <li key={p.href} className={cn('grid', s.place, i === 3 && 'sm:col-span-2')}>
                  <PosterLink bg={s.bg} href={href(p.href)} className="relative flex min-h-56 flex-col justify-between gap-8 overflow-hidden">
                    <span
                      lang="th"
                      aria-hidden
                      className={cn('poster-outline pointer-events-none absolute -right-2 -top-4 select-none font-thai font-medium leading-none', s.big ? 'text-[11rem] md:text-[15rem]' : 'text-[9rem] md:text-[11rem]')}
                    >
                      {STEP_NUMERALS[p.step - 1]}
                    </span>
                    <span className="relative">
                      <span className="block font-poster text-3xl font-bold uppercase leading-none md:text-5xl">{t.routes[p.key].title}</span>
                      <span className="mt-3 block max-w-[34ch] text-sm leading-snug md:text-base">{t.routes[p.key].blurb}</span>
                    </span>
                    <span aria-hidden className="relative self-start transition-transform duration-200 group-hover:translate-x-2">
                      <Chevrons className="w-14" />
                    </span>
                  </PosterLink>
                </li>
              );
            })}
          </ol>
      </PosterFrame>
    </section>
  );
}
