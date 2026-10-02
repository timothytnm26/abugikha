'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { SYLLABLE_EXAMPLES, useBuilderStore } from '@/features/build-syllable';
import { useLocalePath, useT } from '@/shared/i18n';
import { gsap, useGSAP } from '@/shared/lib/gsap';
import { SplitWords } from '@/shared/ui';

/** Phần cuối cam đỏ: tít khổng lồ trồi lên khi cuộn tới, bốn âm tiết mẫu bấm một lần nạp sẵn vào trang ghép chữ. */
export function FooterCtaSection() {
  const t = useT();
  const href = useLocalePath();
  const router = useRouter();
  const setSyllable = useBuilderStore((s) => s.setSyllable);
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.sw', { yPercent: 115, duration: 1, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 70%', once: true } });
        gsap.from('.cta-fade', { opacity: 0, y: 24, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 55%', once: true } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-note-orange text-note-black">
      <div className="page-container flex min-h-[calc(100svh-3.5rem)] flex-col justify-between gap-12 py-16 md:py-24">
        <h2 className="max-w-6xl text-balance font-poster text-[clamp(3.5rem,10vw,10rem)] font-extrabold uppercase leading-[0.9]">
          <SplitWords text={t.home.footerTitle} />
        </h2>
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="cta-fade lg:col-span-5">
            <p className="max-w-[40ch] text-lg leading-snug md:text-xl">{t.home.footerBody}</p>
            <Link href={href('/lab')} className="btn mt-6 border-note-black bg-note-black text-note-cream hover:bg-transparent hover:text-note-black">
              {t.home.cta}
            </Link>
          </div>
          <div className="cta-fade lg:col-span-7">
            <p className="font-poster text-xl font-bold uppercase">{t.builder.coach.try}</p>
            {/* Mỗi ví dụ nạp sẵn âm tiết vào trang ghép rồi mở trang đó */}
            <ul className="mt-3 grid grid-cols-4 gap-3">
              {SYLLABLE_EXAMPLES.map((e) => (
                <li key={e.word}>
                  <button
                    type="button"
                    lang="th"
                    onClick={() => {
                      setSyllable(e);
                      router.push(href('/lab'));
                    }}
                    className="grid min-h-28 w-full place-items-center border-2 border-note-black font-thai text-5xl leading-none text-inherit hover:bg-note-black hover:text-note-cream focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-note-black md:min-h-36 md:text-7xl"
                  >
                    {e.word}
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm">{t.builder.coach.tryHint}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
