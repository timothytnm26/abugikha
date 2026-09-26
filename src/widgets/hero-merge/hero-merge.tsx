"use client";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/shared/lib/gsap";
import { Phonetic, SpeakButton } from "@/shared/ui";
import { useT } from "@/shared/i18n";

/** The homepage's single motion: ค, ะ, and ่ slide together to form ค่ะ. */
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
        .from(".hero-c", {
          x: -60,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        })
        .from(
          ".hero-v",
          { x: 60, opacity: 0, duration: 0.6, ease: "power3.out" },
          "<0.1",
        )
        .from(
          ".hero-mark",
          { y: -30, opacity: 0, duration: 0.5, ease: "power3.out" },
          "<0.1",
        )
        .to(
          ".hero-c",
          { x: "0.9em", duration: 0.45, ease: "power4.in" },
          "+=0.5",
        )
        .to(".hero-v", { x: "-1.5em", duration: 0.45, ease: "power4.in" }, "<")
        .to(
          ".hero-mark",
          { x: "-0.75em", y: "-0.45em", duration: 0.45, ease: "power4.in" },
          "<",
        )
        .to(".hero-plus", { scale: 0, opacity: 0, duration: 0.2 }, "<")
        .to(".hero-parts", { opacity: 0, duration: 0.01 })
        .fromTo(
          ".hero-word",
          { scale: 0.6, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.9, ease: "elastic.out(1, 0.45)" },
          "<",
        )
        .fromTo(
          ".hero-ring",
          { scale: 0.4, opacity: 0.7 },
          { scale: 2.2, opacity: 0, duration: 0.9, ease: "power2.out" },
          "<",
        )
        .from(".hero-ipa", { y: 12, opacity: 0, duration: 0.4 }, "-=0.4");
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative flex flex-col items-start gap-6">
      <div className="relative h-[1.3em] font-thai text-[clamp(6rem,18vw,13rem)] leading-none">
        <span className="hero-parts absolute inset-0 flex items-center gap-[0.15em]">
          <span className="hero-c text-mid">ค</span>
          <span className="hero-plus text-[0.4em] text-ink-soft">+</span>
          <span className="hero-v text-ink/70">◌ะ</span>
          <span className="hero-plus text-[0.4em] text-ink-soft">+</span>
          <span className="hero-mark text-ink/70">◌่</span>
        </span>
        <span className="hero-word relative flex items-center opacity-0">
          <span className="hero-ring pointer-events-none absolute left-1/2 top-1/2 size-[0.9em] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-mid" />
          <span className="text-ink">ค่ะ</span>
        </span>
      </div>
      <div className="hero-ipa flex items-center gap-4">
        <Phonetic ipa="kʰâʔ" className="text-2xl text-tone-falling" />
        <span className="text-ink-soft">{t.home.heroMeaning}</span>
        <SpeakButton text="ค่ะ" />
      </div>
    </div>
  );
}
