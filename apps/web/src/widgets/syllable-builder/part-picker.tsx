"use client";
import { useMemo, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
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
import { fmt, useLocale, useT } from "@/shared/i18n";
import { usePreferences } from "@/shared/lib/preferences";
import { cn, tint } from "@/shared/lib";
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
  vowel: "var(--color-part-vowel)",
  final: "var(--color-part-final)",
};

const pill = (on: boolean) =>
  cn(
    "min-h-9 border px-2.5 py-1 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
    on
      ? "border-ink bg-ink text-paper"
      : "border-current bg-transparent hover:bg-black/10",
  );
const tileCls =
  "pointer-fine:touch-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-25";
/** Ô ký tự viền (âm cuối, dấu thanh) tô theo màu của phần đó; `muted` = ít dùng: viền nhạt, chữ vẫn rõ */
const boxCls = (selected: boolean) =>
  cn(tileCls, "place-items-center border-2 font-thai", selected ? "text-on-accent" : "bg-transparent");
const boxStyle = (color: string, selected: boolean, muted?: boolean): CSSProperties =>
  selected ? { borderColor: color, backgroundColor: color } : { borderColor: tint(color, muted ? 25 : 60), color };

/** Trên màn hình rộng mọi nhóm đều hiện; màn hình hẹp chỉ hiện nhóm của tab đang chọn. */
/** Dải màu áp phích trên đầu mỗi nhóm ở màn hình rộng (dưới xl đã có thanh tab); màu dải chỉ để trang trí, màu của ô mới mang nghĩa. */
const STRIP: Record<PartKind, string> = {
  initial: "xl:bg-poster-blue xl:text-white",
  vowel: "xl:bg-poster-violet xl:text-white",
  final: "xl:bg-poster-orange xl:text-poster-black",
  mark: "xl:bg-poster-green xl:text-white",
};

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
      className={cn(tab !== k && "hidden xl:block", className)}
    >
      <div className={cn("mb-3 flex flex-wrap items-center gap-2 xl:px-3 xl:py-2", STRIP[k])}>
        <h2
          id={`grp-${k}`}
          className="mr-1 font-poster text-2xl font-bold uppercase leading-none max-xl:sr-only"
        >
          {title}
        </h2>
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
          <small className="mt-0.5 block text-xs font-normal leading-tight text-ink-soft">
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
  const { tab, setTab, initialId, vowelId, finalId, mark } = useBuilderStore(
    useShallow((s) => ({ tab: s.tab, setTab: s.setTab, initialId: s.initialId, vowelId: s.vowelId, finalId: s.finalId, mark: s.mark })),
  );
  const { data: initials = [] } = useQuery(consonantQueries.initials());
  const { data: consonants = [] } = useQuery(consonantQueries.all());
  const { data: vowels = [] } = useQuery(vowelQueries.all());
  const showPhonetic = usePreferences((p) => p.showPhonetic);
  const initialChars = INITIAL_BY_ID.get(initialId)!.chars;

  // Chữ ít dùng gập lại cho người mới đỡ rối; chữ đang chọn luôn hiện
  const [showRare, setShowRare] = useState(false);
  const rareCount = initials.filter((u) => !u.common && u.id !== initialId).length;
  const shown = useMemo(() => initials.filter((u) => showRare || u.common || u.id === initialId), [initials, showRare, initialId]);

  const rows = useMemo(() => {
    const of = (kinds: InitialKind[]) => shown.filter((u) => kinds.includes(u.kind));
    return {
      single: Object.fromEntries(CLASSES.map((c) => [c, shown.filter((u) => u.kind === "single" && u.cls === c)])) as Record<ConsonantClass, InitialUnit[]>,
      cluster: of(["cluster"]),
      falseCluster: of(["false-cluster"]),
      leading: of(["leading"]),
    };
  }, [shown]);
  const vowelRows = useMemo(
    () => VOWEL_GROUPS.map((g) => [g, vowels.filter((v) => vowelGroup(v) === g)] as [VowelGroup, Vowel[]]),
    [vowels],
  );
  const finals = consonants.filter((c) => c.final && !c.obsolete);
  const finalDisabled = (ch: string) =>
    !vowel.closed || Boolean(vowel.excludeFinals?.includes(ch));

  useSlotDrag(ref, stageRef, onPick, [shown.length, finals.length, vowels.length]);

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
      aria-label={`${u.chars}, /${u.ipa}/, ${CLASS_META[u.cls].label[locale]}${u.note ? `. ${u.note[locale]}` : ""}`}
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
              aria-label={`${c.char}: /${c.initial}/ → /${snd}/`}
              title={`${c.char}: /${c.initial}/ → /${snd}/`}
              style={boxStyle(ACCENT.final, c.id === finalId, !c.common)}
              className={cn(boxCls(c.id === finalId), "grid size-11 text-xl xl:size-10")}
            >
              {c.char}
            </button>
          ))}
      </div>
    </div>
  );

  return (
    <div ref={ref}>
      <div
        className="mb-4 flex gap-2 overflow-x-auto xl:hidden"
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
              "min-h-11 flex-1 whitespace-nowrap px-2 py-2 text-xs font-medium focus-visible:outline-2 focus-visible:outline-ink sm:px-3 sm:text-sm md:px-1.5 md:text-xs min-[900px]:px-3 min-[900px]:text-sm",
              tab === k ? "bg-poster-black text-poster-lime" : "border-2 border-ink hover:bg-ink hover:text-paper",
            )}
          >
            {t.builder.parts[k]}
          </button>
        ))}
      </div>

      <div className="xl:grid xl:grid-cols-[minmax(0,10fr)_minmax(0,8fr)_minmax(0,7fr)] xl:gap-5">
        <Group
          k="initial"
          tab={tab}
          title={t.builder.parts.initial}
        >
          <div className="space-y-2">
            {CLASSES.map((c) => (
              <Row
                key={c}
                color={CLASS_META[c].color}
                label={`${CLASS_SYMBOL[c]} ${CLASS_META[c].label[locale]}`}
                hint={fmt(t.groups.classCount, { n: CLASS_COUNT[c] })}
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
            {rareCount > 0 && (
              <button
                type="button"
                aria-expanded={showRare}
                onClick={() => setShowRare((v) => !v)}
                className="min-h-11 border border-ink/15 px-4 text-xs font-medium hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                {showRare ? t.builder.hideRare : fmt(t.builder.showRare, { n: rareCount })}
              </button>
            )}
          </div>
        </Group>

        {/* Nguyên âm, dấu thanh xếp ngay bên dưới */}
        <div className="contents xl:block xl:space-y-3">
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
                      aria-label={`${v.open.replace("C", "")}, /${v.ipa}/, ${v.length === "long" ? t.ipa.long : t.ipa.short}. ${v.approx[locale]}`}
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
                style={!mark ? { borderColor: "var(--color-ink)", backgroundColor: "var(--color-ink)", color: "var(--color-paper)" } : { borderColor: tint("var(--color-ink)", 25) }}
                className={cn(boxCls(false), "grid h-11 min-w-11 px-2 font-sans text-xs")}
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
                    style={boxStyle(TONE_META[tone].color, mark === m.id)}
                    className={cn(
                      boxCls(mark === m.id),
                      "h-11 min-w-11 gap-1.5 px-2",
                      showPhonetic ? "flex items-center" : "grid",
                    )}
                  >
                    <span lang="th" className="font-thai text-2xl leading-none">
                      {HOLDER}
                      {m.char}
                    </span>
                    {showPhonetic && (
                      <span className="text-left font-sans text-xs leading-tight">
                        <span className={cn("block", mark !== m.id && "text-ink-soft")}>{m.thai}</span>
                        <span className="block font-medium">
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
