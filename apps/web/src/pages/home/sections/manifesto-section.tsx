'use client';
import { useRef } from 'react';
import { useT } from '@/shared/i18n';
import { gsap, useGSAP } from '@/shared/lib/gsap';
import { Asterisk, ScrubWords } from '@/shared/ui';

/** Phần xanh điện chiếm trọn một màn hình: ghim lại và làm sáng dần từng từ của lời giới thiệu theo thanh cuộn. */
export function ManifestoSection() {
  const t = useT();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const words = '.mw';
      // Màn hình lớn: ghim cả phần trong lúc chữ sáng dần
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(words, { opacity: 0.18 }, { opacity: 1, ease: 'none', stagger: 0.12, scrollTrigger: { trigger: root.current, start: 'top top', end: '+=150%', pin: true, scrub: 0.6 } });
      });
      // Màn hình nhỏ: không ghim, chữ sáng dần khi đi qua giữa màn hình
      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(words, { opacity: 0.18 }, { opacity: 1, ease: 'none', stagger: 0.12, scrollTrigger: { trigger: root.current, start: 'top 65%', end: 'bottom 55%', scrub: 0.6 } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="NarakThai" className="bg-note-sky text-note-black">
      <div className="page-container flex min-h-svh flex-col justify-center py-20">
        <Asterisk className="size-8 text-note-orange md:size-10" />
        <p className="mt-8 max-w-[24ch] font-poster text-[clamp(2.5rem,6.2vw,6rem)] font-bold uppercase leading-[0.98]">
          <ScrubWords text={t.home.body} />
        </p>
      </div>
    </section>
  );
}
