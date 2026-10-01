"use client";
import { useRef, useState } from "react";
import { TONE_EXAMPLES } from "@/entities/phoneme";
import { TONE_META, type Tone } from "@/entities/syllable";
import { gsap, useGSAP } from "@/shared/lib/gsap";
import { speakThai } from "@/shared/lib/speech";
import { useLocale, useT } from "@/shared/i18n";
import { Phonetic } from "@/shared/ui";
import { cn } from "@/shared/lib";

const toPath = (chao: number[]) =>
  chao.map((p, i) => `${i === 0 ? "M" : "L"}${60 + (i * 400) / (chao.length - 1)},${20 + (5 - p) * 50}`).join(" ");

export function ToneContours() {
  const t = useT();
  const { locale } = useLocale();
  const [active, setActive] = useState<Tone>("falling");
  const svg = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const path = svg.current?.querySelector<SVGPathElement>(`[data-tone="${active}"]`);
      if (!path) return;
      const len = path.getTotalLength();
      gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.8, ease: "power2.out" });
    },
    { scope: svg, dependencies: [active], revertOnUpdate: true },
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <svg ref={svg} viewBox="0 0 500 250" className="w-full" aria-label={t.ipa.toneChartAria}>
        {[1, 2, 3, 4, 5].map((n) => (
          <g key={n}>
            <line x1="60" x2="460" y1={20 + (5 - n) * 50} y2={20 + (5 - n) * 50} stroke="currentColor" strokeOpacity={0.08} />
            <text x="40" y={25 + (5 - n) * 50} textAnchor="end" className="fill-ink-soft text-xs">{n}</text>
          </g>
        ))}
        {(Object.keys(TONE_META) as Tone[]).map((tn) => (
          <path
            key={tn}
            data-tone={tn}
            d={toPath(TONE_META[tn].chao)}
            fill="none"
            stroke={TONE_META[tn].color}
            strokeWidth={tn === active ? 8 : 3}
            strokeOpacity={tn === active ? 1 : 0.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
      <div className="space-y-2">
        {TONE_EXAMPLES.map((ex) => {
          const meta = TONE_META[ex.tone];
          const on = ex.tone === active;
          return (
            <button
              key={ex.tone}
              type="button"
              onClick={() => (setActive(ex.tone), speakThai(ex.word))}
              aria-pressed={on}
              className={cn("flex w-full items-center gap-4 px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-ink", on ? "text-on-accent" : "bg-paper-deep hover:bg-ink/10")}
              style={on ? { backgroundColor: meta.color } : undefined}
            >
              <span lang="th" className="font-thai text-3xl">{ex.word}</span>
              <span className="flex-1">
                <Phonetic ipa={ex.ipa} className="block" />
                <span className={cn("block text-xs", on ? "opacity-85" : "text-ink-soft")}>
                  {meta.label[locale]} ({meta.thai}) – {ex.meaning[locale]}
                </span>
              </span>
            </button>
          );
        })}
        <p className="pt-2 text-sm leading-relaxed text-ink-soft">{TONE_META[active].desc[locale]}</p>
      </div>
    </div>
  );
}
