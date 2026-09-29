"use client";
import { CLASS_META } from "../../consonant/@x/syllable";
import type { SyllableAnalysis } from "@abugikha/core/syllable";
import { TONE_META } from "../model/tone";
import { fmt, useT } from "@/shared/i18n";

const COMBINING = /^[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/;

/** Các mảnh của âm tiết theo thứ tự viết, và nguyên âm bao quanh phụ âm thế nào. */
export function PlacementNote({ analysis }: { analysis: SyllableAnalysis }) {
  const t = useT();
  const initial = analysis.segments.find((s) => s.role === "initial")!.text;
  const sides = analysis.placements.map((p) => t.syllable.where[p]).join(" + ");
  const color = (role: string) =>
    role === "initial" ? CLASS_META[analysis.cls].color : role === "mark" ? TONE_META[analysis.tone].color : undefined;
  return (
    <div className="space-y-3 text-sm leading-relaxed">
      <div className="flex flex-wrap items-end gap-1.5" aria-label={t.syllable.partsAria}>
        {analysis.segments.map((s, i) => (
          <span key={i} className="flex flex-col items-center">
            <span
              className="grid min-h-12 min-w-10 place-items-center rounded-xl border-2 bg-paper-deep px-2 font-thai text-2xl"
              style={{ borderColor: color(s.role) ?? "transparent", color: color(s.role) }}
            >
              {COMBINING.test(s.text) ? `◌${s.text}` : s.text}
            </span>
            <span className="mt-1 text-[11px] text-ink-soft">{t.syllable.roles[s.role]}</span>
          </span>
        ))}
      </div>
      {sides && (
        <p>
          {fmt(t.syllable.placement, { sides, initial })}
          {analysis.placements.includes("before") && fmt(t.syllable.placementBefore, { initial })}
        </p>
      )}
    </div>
  );
}
