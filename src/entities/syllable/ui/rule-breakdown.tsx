"use client";
import type { SyllableAnalysis } from "../model/types";
import { useT } from "@/shared/i18n";

/** Các bước suy luận ra thanh điệu – thực sự là một chuỗi nên dùng danh sách có thứ tự. */
export function RuleBreakdown({ analysis }: { analysis: SyllableAnalysis }) {
  const t = useT();
  return (
    <ol className="relative space-y-4 border-l-2 border-ink/10 pl-6">
      {analysis.steps.map((s, i) => (
        <li key={i} className="relative">
          <span className="absolute -left-[31px] top-1 size-3.5 rounded-full border-2 border-paper" style={{ backgroundColor: s.color ?? "var(--color-ink-soft)" }} />
          <p className="text-xs text-ink-soft">{i + 1}. {t.syllable.stepLabels[s.kind]}</p>
          <p className="font-semibold" style={s.color ? { color: s.color } : undefined}>{s.title}</p>
          <p className="text-sm leading-relaxed text-ink/80">{s.detail}</p>
        </li>
      ))}
    </ol>
  );
}
