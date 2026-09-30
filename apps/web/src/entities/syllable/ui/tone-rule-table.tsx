"use client";
import { useRef } from "react";
import { CLASS_META, type ConsonantClass } from "../../consonant/@x/syllable";
import { resolveTone, type SyllableAnalysis, type ToneMarkId } from "@abugikha/core/syllable";
import { TONE_META } from "../model/tone";
import { ToneContour } from "./tone-contour";
import { useLocale, useT, type Locale } from "@/shared/i18n";
import { cn, tint } from "@/shared/lib";
import { gsap, useGSAP, prefersReducedMotion } from "@/shared/lib/gsap";
import { speakThai } from "@/shared/lib/speech";

export type ToneCol = "live" | "dead-short" | "dead-long" | ToneMarkId;
const COLS: ToneCol[] = ["live", "dead-short", "dead-long", "ek", "tho", "tri", "chattawa"];
const MARK_CHAR: Record<ToneMarkId, string> = { ek: "่", tho: "้", tri: "๊", chattawa: "๋" };

/** Một từ ví dụ cho mỗi ô của bảng */
const EXAMPLES: Record<ConsonantClass, Partial<Record<ToneCol, string>>> = {
  mid: { live: "กา", "dead-short": "จะ", "dead-long": "ปาก", ek: "ไก่", tho: "ป้า", tri: "โต๊ะ", chattawa: "ตั๋ว" },
  high: { live: "ขา", "dead-short": "สิบ", "dead-long": "ขาด", ek: "ข่า", tho: "ข้าว" },
  low: { live: "คา", "dead-short": "รัก", "dead-long": "มาก", ek: "พ่อ", tho: "ม้า" },
};

export function toneColumnOf(a: SyllableAnalysis): ToneCol {
  return a.mark ?? (a.liveness === "live" ? "live" : a.length === "short" ? "dead-short" : "dead-long");
}

function toneFor(cls: ConsonantClass, col: ToneCol, locale: Locale) {
  if (col === "live") return resolveTone({ cls, liveness: "live", length: "long", mark: null }, locale);
  if (col === "dead-short") return resolveTone({ cls, liveness: "dead", length: "short", mark: null }, locale);
  if (col === "dead-long") return resolveTone({ cls, liveness: "dead", length: "long", mark: null }, locale);
  return resolveTone({ cls, liveness: "live", length: "long", mark: col }, locale);
}

/** Bảng công thức tối giản; ô đang áp dụng được làm nổi bật và có hiệu ứng khi đổi. */
export function ToneRuleTable({ analysis }: { analysis: SyllableAnalysis }) {
  const t = useT();
  const { locale } = useLocale();
  const cur = { cls: analysis.cls, col: toneColumnOf(analysis) };
  const root = useRef<HTMLDivElement>(null);
  const label: Record<ToneCol, string> = {
    live: t.builder.colLive, "dead-short": t.builder.colDeadShort, "dead-long": t.builder.colDeadLong,
    ek: "◌่", tho: "◌้", tri: "◌๊", chattawa: "◌๋",
  };

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo("[data-current]", { scale: 0.8 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    },
    { scope: root, dependencies: [cur.cls, cur.col] },
  );

  return (
    <div ref={root}>
      <table className="w-full table-fixed border-separate border-spacing-1 text-center text-xs">
        <thead>
          <tr>
            <th className="w-14" />
            <th colSpan={3} className="border-b border-ink/10 pb-1 font-normal text-ink-soft">{t.builder.noMarkGroup}</th>
            <th colSpan={4} className="border-b border-ink/10 pb-1 font-normal text-ink-soft">{t.builder.markGroup}</th>
          </tr>
          <tr>
            <th />
            {COLS.map((c) => (
              <th key={c} scope="col" className={cn("rounded-md px-0.5 py-1 text-[10px] font-medium leading-tight sm:text-[11px]", c in MARK_CHAR && "font-thai text-base", cur.col === c ? "bg-ink text-paper" : "text-ink-soft")}>
                {label[c]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(["mid", "high", "low"] as ConsonantClass[]).map((cls) => (
            <tr key={cls}>
              <th scope="row" className={cn("whitespace-nowrap rounded-md px-1 py-1 font-medium", cur.cls === cls ? "text-on-accent" : "")} style={cur.cls === cls ? { backgroundColor: CLASS_META[cls].color } : { color: CLASS_META[cls].color }}>
                {CLASS_META[cls].label[locale]}
              </th>
              {COLS.map((c) => {
                const r = toneFor(cls, c, locale);
                const on = cur.cls === cls && cur.col === c;
                const ex = EXAMPLES[cls][c];
                const meta = TONE_META[r.tone];
                if (r.irregular) return <td key={c} className="rounded-md border border-dashed border-ink/10 text-ink-soft/50" title={t.builder.rare}>·</td>;
                return (
                  <td key={c} className="p-0">
                    <button
                      type="button"
                      data-current={on ? "" : undefined}
                      onClick={() => ex && speakThai(ex)}
                      title={`${r.rule}${ex ? ` (${ex})` : ""}`}
                      aria-label={`${CLASS_META[cls].label[locale]}, ${label[c]}: ${meta.label[locale]}${ex ? `, ${ex}` : ""}${on ? `, ${t.builder.current}` : ""}`}
                      className={cn(
                        "flex h-8 w-full items-center justify-center rounded-md font-medium focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink",
                        on && "relative z-10 text-on-accent shadow-md ring-2 ring-ink ring-offset-1 ring-offset-paper",
                      )}
                      style={{ backgroundColor: on ? meta.color : tint(meta.color, 13), color: on ? undefined : meta.color }}
                    >
                      <ToneContour tone={r.tone} className="w-6 shrink-0" strokeWidth={5} color={on ? "currentColor" : undefined} />
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
        {(Object.keys(TONE_META) as (keyof typeof TONE_META)[]).map((k) => (
          <li key={k} className="flex items-center gap-1.5" style={{ color: TONE_META[k].color }}>
            <ToneContour tone={k} className="w-5" strokeWidth={5} />
            <span className="text-ink">{TONE_META[k].label[locale]}</span>
          </li>
        ))}
        <li className="flex items-center gap-1.5 text-ink-soft"><span className="grid h-4 w-5 place-items-center rounded border border-dashed border-ink/20">·</span>{t.builder.rare}</li>
      </ul>
    </div>
  );
}
