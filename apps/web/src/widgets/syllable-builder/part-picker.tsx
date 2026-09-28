"use client";
import { useMemo, useRef, type ReactNode, type RefObject } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CLASS_META,
  CONSONANTS,
  INITIAL_BY_ID,
  InitialFace,
  consonantQueries,
  type Consonant,
  type ConsonantClass,
  type FinalSound,
  type InitialKind,
  type InitialUnit,
} from "@/entities/consonant";
import { VOWEL_GROUPS, vowelGroup, type VowelGroup } from "@abugikha/core/vowel";
import {
  VowelFace,
  vowelFitsInitial,
  vowelGlyph,
  vowelQueries,
  type Vowel,
} from "@/entities/vowel";
import {
  TONE_MARKS,
  TONE_META,
  resolveTone,
  type SyllableAnalysis,
} from "@/entities/syllable";
import {
  useBuilderStore,
  useSlotDrag,
  type PartKind,
} from "@/features/build-syllable";
import { useLocale, useT } from "@/shared/i18n";
import { usePreferences } from "@/shared/lib/preferences";
import { cn } from "@/shared/lib";
import { vowelCell } from "./notebook";

const STOPS: FinalSound[] = ["k", "t", "p"];
const SONORANTS: FinalSound[] = ["m", "n", "ŋ", "j", "w"];
const TABS: PartKind[] = ["initial", "vowel", "final", "mark"];
const CLASSES: ConsonantClass[] = ["mid", "high", "low"];
/** Ký hiệu hình cho từng nhóm để không chỉ dựa vào màu */
const CLASS_SYMBOL: Record<ConsonantClass, string> = { mid: "●", high: "▲", low: "▼" };
const CLASS_COUNT = Object.fromEntries(CLASSES.map((c) => [c, CONSONANTS.filter((x) => x.cls === c).length])) as Record<ConsonantClass, number>;
/** Chỗ giữ vị trí phụ âm trên ô chọn (có trong font chữ Thái, khác với khoảng trắng) */
const HOLDER = "◌";

/** Màu đánh dấu ô đích khi kéo (vowel/final không có ngữ nghĩa màu riêng) */
const ACCENT = {
  vowel: "var(--color-tone-rising)",
  final: "var(--color-tone-high)",
};

const pill = (on: boolean) =>
  cn(
    "rounded-md border px-2 py-0.5 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
    on
      ? "border-ink bg-ink text-paper"
      : "border-ink/25 bg-transparent hover:bg-ink/5",
  );
const tileCls =
  "touch-none rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-25";
/** Ô ký tự viền (âm cuối, dấu thanh); `muted` = ít dùng: nền/viền nhạt, chữ vẫn rõ */
const boxCls = (selected: boolean, muted?: boolean) =>
  cn(
    tileCls,
    "place-items-center border-2 font-thai",
    selected
      ? "border-ink bg-ink text-paper"
      : muted
        ? "border-ink/5 bg-transparent text-ink/85"
        : "border-ink/25 bg-transparent",
  );

/** Trên màn hình rộng mọi nhóm đều hiện; màn hình hẹp chỉ hiện nhóm của tab đang chọn. */
function Group({
  k,
  tab,
  title,
  children,
  extra,
  className,
}: {
  k: PartKind;
  tab: PartKind;
  title: string;
  children: ReactNode;
  extra?: ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-labelledby={`grp-${k}`}
      className={cn(tab !== k && "hidden lg:block", className)}
    >
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <h3
          id={`grp-${k}`}
          className="mr-1 text-sm font-semibold max-lg:sr-only"
        >
          {title}
        </h3>
        {extra}
      </div>
      {children}
    </section>
  );
}

/** Một hàng trong nhóm: nhãn bên trái (tên + gợi ý), các ô bên phải. */
function Row({
  label,
  hint,
  color,
  children,
}: {
  label: ReactNode;
  hint?: string;
  color?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div
        className="w-[4.75rem] shrink-0 pt-1.5 text-xs font-semibold leading-tight"
        style={color ? { color } : undefined}
      >
        {label}
        {hint && (
          <small className="mt-0.5 block text-[10.5px] font-normal leading-tight text-ink-soft">
            {hint}
          </small>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-wrap gap-1">{children}</div>
    </div>
  );
}

interface Props {
  vowel: Vowel;
  analysis: SyllableAnalysis;
  stageRef: RefObject<HTMLElement | null>;
  onPick: (kind: PartKind, id: string | null) => void;
}

export function PartPicker({ vowel, analysis, stageRef, onPick }: Props) {
  const t = useT();
  const { locale } = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const { tab, setTab, initialId, vowelId, finalId, mark } = useBuilderStore();
  const { data: initials = [] } = useQuery(consonantQueries.initials());
  const { data: consonants = [] } = useQuery(consonantQueries.all());
  const { data: vowels = [] } = useQuery(vowelQueries.all());
  const showPhonetic = usePreferences((p) => p.showPhonetic);
  const initialChars = INITIAL_BY_ID.get(initialId)!.chars;

  const rows = useMemo(() => {
    const of = (kinds: InitialKind[]) => initials.filter((u) => kinds.includes(u.kind));
    return {
      single: Object.fromEntries(CLASSES.map((c) => [c, initials.filter((u) => u.kind === "single" && u.cls === c)])) as Record<ConsonantClass, InitialUnit[]>,
      cluster: of(["cluster"]),
      falseCluster: of(["false-cluster"]),
      leading: of(["leading"]),
    };
  }, [initials]);
  const vowelRows = useMemo(
    () => VOWEL_GROUPS.map((g) => [g, vowels.filter((v) => vowelGroup(v) === g)] as [VowelGroup, Vowel[]]),
    [vowels],
  );
  const finals = consonants.filter((c) => c.final && !c.obsolete);
  const finalDisabled = (ch: string) =>
    !vowel.closed || Boolean(vowel.excludeFinals?.includes(ch));

  useSlotDrag(ref, stageRef, onPick, [
    vowel.id,
    initialId,
    initials.length,
    finals.length,
    analysis.cls,
    analysis.liveness,
    showPhonetic,
  ]);

  const initialTile = (u: InitialUnit) => (
    <button
      key={u.id}
      type="button"
      data-tile
      data-kind="initial"
      data-id={u.id}
      data-glyph={u.chars}
      data-accent={CLASS_META[u.cls].color}
      onClick={() => onPick("initial", u.id)}
      aria-pressed={u.id === initialId}
      aria-label={`${u.chars}, /${u.ipa}/, ${CLASS_META[u.cls].label[locale]}`}
      title={u.note?.[locale]}
      className={tileCls}
    >
      <InitialFace
        unit={u}
        size="sm"
        selected={u.id === initialId}
        phonetic={showPhonetic}
        muted={!u.common && u.id !== initialId}
      />
    </button>
  );

  const finalRow = (snd: FinalSound) => (
    <div key={snd} className="flex items-start gap-1.5">
      <span className="mt-1.5 w-9 shrink-0 text-center font-ipa text-sm text-ink-soft">
        /{snd}/
      </span>
      <div className="flex flex-wrap gap-1">
        {finals
          .filter((c: Consonant) => c.final === snd)
          .map((c) => (
            <button
              key={c.id}
              type="button"
              data-tile
              data-kind="final"
              data-id={c.id}
              data-glyph={c.char}
              data-accent={ACCENT.final}
              disabled={finalDisabled(c.char)}
              onClick={() => onPick("final", c.id)}
              aria-pressed={c.id === finalId}
              title={`${c.char}: /${c.initial}/ → /${snd}/`}
              className={cn(
                boxCls(c.id === finalId, !c.common),
                "grid size-9 text-xl",
              )}
            >
              {c.char}
            </button>
          ))}
      </div>
    </div>
  );

  return (
    <div ref={ref} className="rounded-xl border border-ink/10 p-3 md:p-4">
      <div
        className="mb-3 flex gap-1 overflow-x-auto rounded-lg bg-paper-deep p-1 lg:hidden"
        role="group"
        aria-label={t.builder.tabsAria}
      >
        {TABS.map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={tab === k}
            onClick={() => setTab(k)}
            className={cn(
              "flex-1 whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium focus-visible:outline-2 focus-visible:outline-ink sm:px-3 sm:text-sm",
              tab === k ? "bg-ink text-paper" : "hover:bg-ink/10",
            )}
          >
            {t.builder.parts[k]}
          </button>
        ))}
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-6 xl:grid-cols-[minmax(0,10fr)_minmax(0,8fr)_minmax(0,7fr)] xl:gap-5">
        <Group
          k="initial"
          tab={tab}
          title={t.builder.parts.initial}
          className="lg:row-span-2 xl:row-span-1"
        >
          <div className="space-y-2">
            {CLASSES.map((c) => (
              <Row
                key={c}
                color={CLASS_META[c].color}
                label={`${CLASS_SYMBOL[c]} ${CLASS_META[c].label[locale]}`}
                hint={t.groups.classCount(CLASS_COUNT[c])}
              >
                {rows.single[c].map(initialTile)}
              </Row>
            ))}
            <div className="space-y-2 border-t border-dashed border-ink/15 pt-2">
              <Row label={t.groups.cluster} hint={t.groups.clusterHint}>
                {rows.cluster.map(initialTile)}
              </Row>
              <Row label={t.groups.falseCluster} hint={t.groups.falseClusterHint}>
                {rows.falseCluster.map(initialTile)}
              </Row>
              <Row label={t.groups.leading} hint={t.groups.leadingHint}>
                {rows.leading.map(initialTile)}
              </Row>
            </div>
          </div>
        </Group>

        {/* Nguyên âm, dấu thanh xếp ngay bên dưới */}
        <div className="contents lg:block lg:space-y-3">
          <Group k="vowel" tab={tab} title={t.builder.parts.vowel}>
            <div className="space-y-2">
              {vowelRows.map(([g, list]) => (
                <Row key={g} label={t.groups.vowels[g]} hint={t.groups.vowelHints[g]}>
                  {list.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      data-tile
                      data-kind="vowel"
                      data-target-slot={`vowel-${vowelCell(v.open)}`}
                      data-id={v.id}
                      data-glyph={vowelGlyph(v)}
                      data-accent={ACCENT.vowel}
                      disabled={!vowelFitsInitial(v, initialChars)}
                      onClick={() => onPick("vowel", v.id)}
                      aria-pressed={v.id === vowelId}
                      aria-label={`${v.open.replace("C", "")}, /${v.ipa}/, ${v.length === "long" ? t.ipa.long : t.ipa.short}`}
                      title={v.approx[locale]}
                      className={tileCls}
                    >
                      <VowelFace
                        vowel={v}
                        size="sm"
                        selected={v.id === vowelId}
                        phonetic={showPhonetic}
                        holder={HOLDER}
                      />
                    </button>
                  ))}
                </Row>
              ))}
            </div>
          </Group>

          <Group k="mark" tab={tab} title={t.builder.parts.mark}>
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => onPick("mark", null)}
                aria-pressed={!mark}
                className={cn(
                  boxCls(!mark),
                  "grid h-11 min-w-11 px-2 font-sans text-xs",
                )}
              >
                {t.builder.noMark}
              </button>
              {TONE_MARKS.map((m) => {
                // Màu = thanh mà dấu này sẽ tạo ra với phụ âm đầu hiện tại
                const tone = resolveTone({
                  cls: analysis.cls,
                  liveness: analysis.liveness,
                  length: analysis.length,
                  mark: m.id,
                }).tone;
                return (
                  <button
                    key={m.id}
                    type="button"
                    data-tile
                    data-kind="mark"
                    data-id={m.id}
                    data-glyph={`◌${m.char}`}
                    data-accent={TONE_META[tone].color}
                    onClick={() => onPick("mark", m.id)}
                    aria-pressed={mark === m.id}
                    aria-label={`${m.thai} (${m.latin}) → ${TONE_META[tone].label[locale]}`}
                    className={cn(
                      boxCls(mark === m.id),
                      "h-11 min-w-11 gap-1.5 px-2",
                      showPhonetic ? "flex items-center" : "grid",
                    )}
                  >
                    <span className="font-thai text-2xl leading-none">
                      {HOLDER}
                      {m.char}
                    </span>
                    {showPhonetic && (
                      <span className="text-left font-sans text-[10px] leading-tight">
                        <span className="block text-ink-soft">{m.thai}</span>
                        <span
                          className="block font-medium"
                          style={{ color: TONE_META[tone].color }}
                        >
                          → {TONE_META[tone].label[locale]}
                        </span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </Group>
        </div>

        <Group
          k="final"
          tab={tab}
          title={t.builder.parts.final}
          extra={
            <button
              type="button"
              onClick={() => onPick("final", null)}
              aria-pressed={!finalId}
              className={pill(!finalId)}
            >
              {t.groups.finals.none} · {t.groups.finalHints.none}
            </button>
          }
        >
          {!vowel.closed && (
            <p className="mb-1.5 text-xs text-high">{t.builder.vowelNoFinal}</p>
          )}
          <div className="space-y-2">
            <Row label={t.groups.finals.live} hint={t.groups.finalHints.live}>
              <div className="w-full space-y-1">{SONORANTS.map(finalRow)}</div>
            </Row>
            <div className="border-t border-dashed border-ink/15 pt-2">
              <Row label={t.groups.finals.dead} hint={t.groups.finalHints.dead}>
                <div className="w-full space-y-1">{STOPS.map(finalRow)}</div>
              </Row>
            </div>
          </div>
        </Group>
      </div>
    </div>
  );
}
