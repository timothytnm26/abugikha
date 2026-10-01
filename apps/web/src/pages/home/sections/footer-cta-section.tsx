'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { SYLLABLE_EXAMPLES, useBuilderStore } from '@/features/build-syllable';
import { useLocalePath, useT } from '@/shared/i18n';
import { useTileReveal } from '@/shared/lib/use-tile-reveal';
import { PosterFrame, PosterTile, type PosterBg } from '@/shared/ui';

const CHIP_BG: PosterBg[] = ['blue', 'orange', 'violet', 'green'];

export function FooterCtaSection() {
  const t = useT();
  const href = useLocalePath();
  const router = useRouter();
  const setSyllable = useBuilderStore((s) => s.setSyllable);
  const root = useRef<HTMLDivElement>(null);
  useTileReveal(root);
  return (
    <section className="screen relative">
      <div className="page-container w-full py-10 md:py-14">
        <PosterFrame ref={root}>
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <PosterTile bg="cream" themed pad="p-6 md:p-10 lg:p-12" className="flex flex-col justify-between gap-8 lg:col-span-7">
              <div>
                <h2 className="text-balance font-poster text-5xl font-extrabold uppercase leading-[0.98] md:text-7xl">{t.home.footerTitle}</h2>
                <p className="mt-4 max-w-[44ch] md:text-lg">{t.home.footerBody}</p>
              </div>
              <Link href={href('/lab')} className="btn btn-primary self-start">
                {t.home.cta}
              </Link>
            </PosterTile>
            <div className="grid grid-cols-2 lg:col-span-5">
              <PosterTile bg="lime" className="col-span-2 flex items-center py-4 md:py-5">
                <p className="font-poster text-xl font-bold uppercase leading-tight md:text-2xl">{t.builder.coach.try}</p>
              </PosterTile>
              {/* Mỗi ví dụ nạp sẵn âm tiết vào trang ghép rồi mở trang đó */}
              {SYLLABLE_EXAMPLES.map((e, i) => (
                <PosterTile key={e.word} bg={CHIP_BG[i]} pad="p-0" className="grid">
                  <button
                    type="button"
                    lang="th"
                    onClick={() => {
                      setSyllable(e);
                      router.push(href('/lab'));
                    }}
                    className="grid min-h-40 place-items-center font-thai text-7xl font-medium leading-none focus-visible:outline-4 focus-visible:-outline-offset-8 focus-visible:outline-poster-lime md:text-8xl"
                  >
                    {e.word}
                  </button>
                </PosterTile>
              ))}
              <PosterTile bg="black" className="col-span-2 py-4 md:py-5">
                <p className="text-sm text-poster-lime md:text-base">{t.builder.coach.tryHint}</p>
              </PosterTile>
            </div>
          </div>
        </PosterFrame>
      </div>
    </section>
  );
}
