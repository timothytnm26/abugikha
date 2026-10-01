"use client";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/shared/lib/gsap";
import { Phonetic, SpeakButton } from "@/shared/ui";
import { useT } from "@/shared/i18n";

/** Chuyển động mở đầu của trang chủ: ค, ะ và ่ trượt vào nhau thành ค่ะ trên tờ giấy ghi chú. */
export function HeroMerge() {
  const root = useRef<HTMLDivElement>(null);
  const t = useT();
  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(".hero-parts", { opacity: 0 });
        gsap.set(".hero-word", { opacity: 1 });
        return;
      }
      gsap
        .timeline({ delay: 0.4 })
        .from(".hero-c", { x: -60, opacity: 0, duration: 0.6, ease: "power3.out" })
        .from(".hero-v", { x: 60, opacity: 0, duration: 0.6, ease: "power3.out" }, "<0.1")
        .from(".hero-mark", { y: -30, opacity: 0, duration: 0.5, ease: "power3.out" }, "<0.1")
        .to(".hero-c", { x: "0.9em", duration: 0.45, ease: "power4.in" }, "+=0.5")
        .to(".hero-v", { x: "-1.5em", duration: 0.45, ease: "power4.in" }, "<")
        .to(".hero-mark", { x: "-0.75em", y: "-0.45em", duration: 0.45, ease: "power4.in" }, "<")
        .to(".hero-plus", { scale: 0, opacity: 0, duration: 0.2 }, "<")
        .to(".hero-parts", { opacity: 0, duration: 0.01 })
        .fromTo(".hero-word", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: "elastic.out(1, 0.45)" }, "<")
        .fromTo(".hero-ring", { scale: 0.4, opacity: 0.7 }, { scale: 2.2, opacity: 0, duration: 0.9, ease: "power2.out" }, "<")
        .from(".hero-ipa", { y: 12, opacity: 0, duration: 0.4 }, "-=0.4");
    },
    { scope: root },
  );

  return (
    <div ref={root} className="@container relative flex w-full flex-col items-center gap-4 text-center">
      <div lang="th" className="relative h-[1.3em] w-full font-thai text-[clamp(3rem,26cqw,10rem)] leading-none">
        <span className="hero-parts absolute inset-0 flex items-center justify-center gap-[0.15em]">
          <span className="hero-c text-mid">ค</span>
          <span className="hero-plus text-[0.4em] text-ink-soft">+</span>
          <span className="hero-v text-part-vowel">◌ะ</span>
          <span className="hero-plus text-[0.4em] text-ink-soft">+</span>
          <span className="hero-mark text-tone-falling">◌่</span>
        </span>
        <span className="hero-word note-glyph relative flex items-center justify-center opacity-0">
          <span className="hero-ring pointer-events-none absolute left-1/2 top-1/2 size-[0.9em] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-tone-falling" />
          <span>
            <span className="text-mid">ค</span>
            <span className="text-tone-falling">่</span>
            <span className="text-part-vowel">ะ</span>
          </span>
        </span>
      </div>
      <div className="hero-ipa flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <Phonetic ipa="kʰâʔ" className="text-2xl text-tone-falling" />
        <span className="text-ink-soft">{t.home.heroMeaning}</span>
        <SpeakButton text="ค่ะ" />
      </div>
    </div>
  );
}
