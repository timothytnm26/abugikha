"use client";
import { useRef, useState } from "react";
import { DIPHTHONGS, VOWEL_PHONES, type VowelPhone } from "@/entities/phoneme";
import { gsap, useGSAP, prefersReducedMotion } from "@/shared/lib/gsap";
import { fmt, useLocale, useT } from "@/shared/i18n";
import { Phonetic, SpeakButton } from "@/shared/ui";
import { cn } from "@/shared/lib";

// Hình thang: đỉnh trên (y=0) từ x=120 đến 560, đáy từ 270 đến 560; chừa 70px phía trên cho nhãn
const TOP = 80;
const pos = (p: { x: number; y: number }) => {
  const left = 120 + p.y * 150;
  return { cx: left + p.x * (560 - left), cy: TOP + p.y * 280 };
};
const byIpa = (ipa: string) => VOWEL_PHONES.find((v) => v.ipa === ipa)!;

type Diph = (typeof DIPHTHONGS)[number];

export function VowelChart() {
  const t = useT();
  const { locale } = useLocale();
  const [sel, setSel] = useState<VowelPhone | Diph>(VOWEL_PHONES[1]);
  const svg = useRef<SVGSVGElement>(null);
  const isDiph = "from" in sel;

  useGSAP(
    () => {
      const path = svg.current?.querySelector<SVGPathElement>(".diph-path");
      if (!path || prefersReducedMotion()) return;
      const len = path.getTotalLength();
      gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" });
    },
    { scope: svg, dependencies: [sel], revertOnUpdate: true },
  );

  const diphPath = isDiph
    ? (() => {
        const a = pos(byIpa(sel.from));
        const b = pos(byIpa(sel.to));
        return `M${a.cx},${a.cy} Q${(a.cx + b.cx) / 2 + 40},${(a.cy + b.cy) / 2} ${b.cx},${b.cy}`;
      })()
    : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div>
        <svg ref={svg} viewBox="0 0 620 400" className="w-full" role="group" aria-label={t.ipa.vowelChartAria}>
          <polygon points={`120,${TOP} 560,${TOP} 560,${TOP + 280} 270,${TOP + 280}`} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={2} />
          <line x1="170" y1={TOP + 93} x2="560" y2={TOP + 93} stroke="currentColor" strokeOpacity={0.08} />
          <line x1="220" y1={TOP + 187} x2="560" y2={TOP + 187} stroke="currentColor" strokeOpacity={0.08} />
          <text x="120" y="28" className="fill-ink-soft text-[0.8125rem]">← {t.ipa.front}</text>
          <text x="586" y="28" textAnchor="end" className="fill-ink-soft text-[0.8125rem]">{t.ipa.back} →</text>
          <text x="80" y={TOP + 5} textAnchor="end" className="fill-ink-soft text-[0.8125rem]">{t.ipa.high}</text>
          <text x="230" y={TOP + 285} textAnchor="end" className="fill-ink-soft text-[0.8125rem]">{t.ipa.low}</text>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="var(--color-low)" />
            </marker>
          </defs>
          {diphPath && <path className="diph-path" d={diphPath} fill="none" stroke="var(--color-low)" strokeWidth={4} strokeLinecap="round" markerEnd="url(#arrow)" />}
          {VOWEL_PHONES.map((v) => {
            const { cx, cy } = pos(v);
            const active = !isDiph && sel.ipa === v.ipa;
            return (
              <g
                key={v.ipa}
                role="button"
                tabIndex={0}
                aria-pressed={active}
                aria-label={fmt(t.ipa.vowelAria, { ipa: v.ipa })}
                onClick={() => setSel(v)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setSel(v))}
                className="cursor-pointer outline-none [&:focus-visible>circle]:stroke-ink [&:focus-visible>circle]:stroke-[3]"
              >
                <circle cx={cx} cy={cy} r={26} className={active ? "fill-ink" : "fill-paper-deep hover:fill-ink/15"} strokeDasharray={v.rounded ? "4 3" : undefined} stroke={v.rounded ? "currentColor" : "none"} strokeOpacity={0.5} />
                <text x={cx} y={cy + 8} textAnchor="middle" className={cn("pointer-events-none font-ipa text-2xl", active ? "fill-paper" : "fill-ink")}>{v.ipa}</text>
              </g>
            );
          })}
        </svg>
        <p className="mt-1 text-xs text-ink-soft">{t.ipa.rounded}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="self-center text-sm text-ink-soft">{t.ipa.diphthongs}</span>
          {DIPHTHONGS.map((d) => (
            <button
              key={d.ipa}
              type="button"
              onClick={() => setSel(d)}
              aria-pressed={isDiph && sel.ipa === d.ipa}
              className={cn("rounded-full px-4 py-1.5 font-ipa text-lg focus-visible:outline-2 focus-visible:outline-ink", isDiph && sel.ipa === d.ipa ? "bg-low text-on-accent" : "bg-paper-deep hover:bg-ink/10")}
            >
              {d.ipa}
            </button>
          ))}
        </div>
      </div>

      <aside className="rounded-3xl bg-paper-deep p-6">
        <p role="status" className="sr-only">{`/${sel.ipa}/ ≈ ${sel.approx[locale]}`}</p>
        <Phonetic ipa={sel.ipa} className="text-5xl" />
        <p className="mt-2">≈ {sel.approx[locale]}</p>
        {isDiph ? (
          <p lang="th" className="mt-4 font-thai text-4xl">{sel.thai}</p>
        ) : (
          <div className="mt-4 flex gap-3">
            <div className="flex-1 rounded-2xl border-2 border-dashed border-ink/25 p-3 text-center">
              <p lang="th" className="font-thai text-3xl">{sel.short}</p>
              <p className="text-xs text-ink-soft">{t.ipa.short}</p>
            </div>
            <div className="flex-1 rounded-2xl border-2 border-ink/25 p-3 text-center">
              <p lang="th" className="font-thai text-3xl">{sel.long}</p>
              <p className="text-xs text-ink-soft">{t.ipa.long}</p>
            </div>
          </div>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span lang="th" className="font-thai text-3xl">{sel.example}</span>
          <Phonetic ipa={sel.exampleIpa} className="text-ink-soft" />
          <SpeakButton text={sel.example} />
        </div>
        <p className="text-sm text-ink-soft">{sel.meaning[locale]}</p>
        <p className="mt-5 text-sm leading-relaxed text-ink-soft">{t.ipa.lengthNote}</p>
      </aside>
    </div>
  );
}
