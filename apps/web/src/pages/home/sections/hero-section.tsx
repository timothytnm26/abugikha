'use client';
import { useRef } from 'react';
import { HeroMerge } from '@/widgets/hero-merge';
import { useLocalePath, useT } from '@/shared/i18n';
import { useTileReveal } from '@/shared/lib/use-tile-reveal';
import { Chevrons, PosterFrame, PosterLink, PosterTile } from '@/shared/ui';

/** Áp phích mở đầu: lưới ô phẳng khít nhau, tít condensed to nhất ở ô xanh, ค่ะ ghép chữ trên ô kem, hai nút là hai ô đen và cam. */
export function HeroSection() {
  const t = useT();
  const href = useLocalePath();
  const root = useRef<HTMLDivElement>(null);
  useTileReveal(root);
  return (
    <section className="screen relative">
      <div className="page-container w-full py-6 md:py-10">
        <PosterFrame ref={root}>
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-[repeat(6,minmax(4.75rem,auto))]">
            <PosterTile bg="blue" className="flex items-end lg:col-span-7 lg:row-span-3">
              <h1 className="text-balance font-poster text-6xl font-extrabold uppercase leading-[0.98] md:text-8xl lg:text-7xl xl:text-[5.5rem]">{t.home.headline}</h1>
            </PosterTile>

            <PosterTile bg="lime" className="flex items-center lg:col-span-5 lg:row-span-2">
              <p className="max-w-[34ch] text-lg font-medium leading-snug md:text-xl">{t.home.body}</p>
            </PosterTile>

            <PosterTile bg="cream" themed className="lg:col-span-5 lg:row-span-4 lg:col-start-8">
              <HeroMerge />
            </PosterTile>

            <PosterTile bg="violet" className="flex flex-col justify-between gap-4 lg:col-span-4 lg:row-span-2 lg:col-start-1">
              <span lang="th" aria-hidden className="poster-outline font-thai text-7xl font-medium leading-none md:text-8xl">น่ารัก</span>
              <p className="max-w-[30ch] text-sm leading-snug text-poster-lime md:text-base">
                <span lang="th" className="font-thai">“น่ารัก”</span> {t.home.tagline}
              </p>
            </PosterTile>

            <PosterLink bg="black" href={href('/lab')} className="flex flex-col justify-between gap-6 lg:col-span-3 lg:row-span-2">
              <span className="font-poster text-3xl font-bold uppercase leading-none md:text-4xl">{t.home.cta}</span>
              <Chevrons className="w-16 transition-transform duration-200 group-hover:translate-x-2" />
            </PosterLink>

            <PosterLink bg="orange" href={href('/aksornthai')} className="flex items-center justify-between gap-4 py-4 md:py-5 lg:col-span-7">
              <span className="font-poster text-2xl font-bold uppercase leading-none md:text-3xl">{t.home.ctaSecondary}</span>
              <span aria-hidden className="text-3xl leading-none transition-transform duration-200 group-hover:translate-x-2">→</span>
            </PosterLink>
          </div>
        </PosterFrame>
      </div>
    </section>
  );
}
