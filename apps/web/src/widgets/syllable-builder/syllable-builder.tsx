"use client";
import { useCallback, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { CONSONANT_BY_ID, INITIAL_BY_ID } from "@/entities/consonant";
import { VOWEL_BY_ID, vowelFitsInitial } from "@/entities/vowel";
import { ToneRuleTable, analyzeSyllable } from "@/entities/syllable";
import { findWords, lexiconQueries } from "@/entities/lexicon";
import { useBuilderStore, type PartKind } from "@/features/build-syllable";
import { useLocale, useT } from "@/shared/i18n";
import { usePreferences } from "@/shared/lib/preferences";
import { speakThai } from "@/shared/lib/speech";
import { SumStage } from "./sum-stage";
import { PartPicker } from "./part-picker";
import { BuilderCoach } from "./builder-coach";

/**
 * Desktop (xl): [ vở xem trước ][ bảng thanh ]   Tablet (md): [ vở xem trước (dính) ][ chọn (tab)  ]
 *                [ chọn thành phần (rộng)  ]                  [                    ][ bảng thanh ]
 * Mobile: vở xem trước → chọn thành phần (tab) → bảng thanh
 */
export function SyllableBuilder() {
  const t = useT();
  const { locale } = useLocale();
  const { initialId, vowelId, finalId, mark, setPart } = useBuilderStore();
  const initial = INITIAL_BY_ID.get(initialId)!;
  const vowel = VOWEL_BY_ID.get(vowelId)!;
  const final = finalId ? CONSONANT_BY_ID.get(finalId)! : null;
  const analysis = useMemo(() => analyzeSyllable({ initial, vowel, final, mark }, locale), [initial, vowel, final, mark, locale]);
  const { data: lexicon = [] } = useQuery(lexiconQueries.all());
  const words = useMemo(() => findWords(lexicon, analysis.spelling), [lexicon, analysis.spelling]);
  const stage = useRef<HTMLDivElement>(null);

  const pick = useCallback(
    (kind: PartKind, id: string | null) => {
      const s = useBuilderStore.getState();
      // Đổi nguyên âm mà âm cuối hiện tại không hợp lệ nữa → bỏ âm cuối
      if (kind === "vowel" && id && s.finalId) {
        const v = VOWEL_BY_ID.get(id)!;
        const f = CONSONANT_BY_ID.get(s.finalId)!;
        if (!v.closed || v.excludeFinals?.includes(f.char)) s.setPart("final", null);
      }
      // Chọn cụm có ว khi nguyên âm là /ua/ → chuyển sang /aː/
      if (kind === "initial" && id && !vowelFitsInitial(VOWEL_BY_ID.get(s.vowelId)!, INITIAL_BY_ID.get(id)!.chars)) s.setPart("vowel", "aa");
      setPart(kind, id);
      // Người dùng tắt âm thanh: chỉ hiện âm tiết, không đọc
      if (!usePreferences.getState().autoSpeak) return;
      const next = useBuilderStore.getState();
      const a = analyzeSyllable({
        initial: INITIAL_BY_ID.get(next.initialId)!,
        vowel: VOWEL_BY_ID.get(next.vowelId)!,
        final: next.finalId ? CONSONANT_BY_ID.get(next.finalId)! : null,
        mark: next.mark,
      });
      speakThai(a.spelling);
    },
    [setPart],
  );

  return (
    <>
    <BuilderCoach />
    <div className="grid grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-[minmax(0,23rem)_minmax(0,1fr)] md:gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] xl:items-start">
      {/* Máy tính bảng: tờ xem trước dính ở bên trái để vừa chọn vừa thấy kết quả */}
      <div className="md:sticky md:top-[4.5rem] md:col-start-1 md:row-span-2 md:row-start-1 md:max-h-[calc(100dvh-5.5rem)] md:self-start md:overflow-y-auto md:pt-3 xl:static xl:row-span-1 xl:max-h-none xl:overflow-visible xl:pt-0">
        <SumStage ref={stage} analysis={analysis} initial={initial} vowel={vowel} final={final} words={words} />
      </div>

      <div className="md:col-start-2 md:row-start-1 xl:col-span-2 xl:col-start-1 xl:row-start-2">
        <PartPicker stageRef={stage} vowel={vowel} analysis={analysis} onPick={pick} />
      </div>

      <section aria-label={t.builder.tableTitle} className="rounded-2xl border border-ink/10 p-2.5 md:col-start-2 md:row-start-2 md:p-3 xl:col-start-2 xl:row-start-1">
        <ToneRuleTable analysis={analysis} />
      </section>
    </div>
    </>
  );
}
