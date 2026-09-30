"use client";
import {
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CLASS_META,
  INITIAL_BY_ID,
  InitialFace,
  consonantQueries,
  type Consonant,
  type ConsonantClass,
  type FinalSound,
  type InitialUnit,
} from "@/entities/consonant";
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
import { PhoneticSwitch } from "@/features/customize-appearance";
import { useLocale, useT } from "@/shared/i18n";
import { usePreferences } from "@/shared/lib/preferences";
import { cn, tint } from "@/shared/lib";

const STOPS: FinalSound[] = ["k", "t", "p"];
const SONORANTS: FinalSound[] = ["m", "n", "ŋ", "j", "w"];
const TABS: PartKind[] = ["initial", "vowel", "final", "mark"];
/** Chỗ giữ vị trí phụ âm trên ô chọn: khoảng trắng không ngắt thay cho vòng chấm ◌ */
const HOLDER = "\u00A0";

/** Màu đánh dấu ô đích khi kéo (vowel/final không có ngữ nghĩa màu riêng) */
const ACCENT = {
  vowel: "var(--color-vowel)",
  final: "var(--color-final)",
};

const pill = (on: boolean) =>
  cn(
    "rounded-md border px-2 py-0.5 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
    on
      ? "border-ink bg-ink text-paper"
      : "border-ink/25 bg-transparent hover:bg-ink/5",
  );
const tileCls =
  "pointer-fine:touch-none rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-25";
/** Ô ký tự viền (âm cuối, dấu thanh) tô theo màu của phần đó; `muted` = ít dùng: viền nhạt, chữ vẫn rõ */
const boxCls = (selected: boolean) =>
  cn(tileCls, "place-items-center border-2 font-thai", selected ? "text-on-accent" : "bg-transparent");
const boxStyle = (color: string, selected: boolean, muted?: boolean): CSSProperties =>
  selected
    ? { borderColor: color, backgroundColor: color }
    : { borderColor: tint(color, muted ? 25 : 60), color };

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
      className={cn(tab !== k && "hidden xl:block", className)}
    >
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <h3
          id={`grp-${k}`}
          className="mr-1 text-sm font-semibold max-xl:sr-only"
        >
          {title}
        </h3>
        {extra}
      </div>
      {children}
    </section>
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
  const [cls, setCls] = useState<"all" | ConsonantClass>("all");
  const showPhonetic = usePreferences((p) => p.showPhonetic);
  const initialChars = INITIAL_BY_ID.get(initialId)!.chars;

  const byClass = useMemo(
    () => initials.filter((u) => cls === "all" || u.cls === cls),
    [initials, cls],
  );
  const rows = useMemo(
    () => ({
      single: byClass.filter((u) => u.kind === "single"),
      cluster: byClass.filter(
        (u) => u.kind === "cluster" || u.kind === "false-cluster",
      ),
      leading: byClass.filter((u) => u.kind === "leading"),
    }),
    [byClass],
  );
  const finals = consonants.filter((c) => c.final && !c.obsolete);
  const finalDisabled = (ch: string) =>
    !vowel.closed || Boolean(vowel.excludeFinals?.includes(ch));

  useSlotDrag(ref, stageRef, onPick, [
    vowel.id,
    initialId,
    cls,
    byClass.length,
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
      <div className="flex flex-wrap gap-1.5 xl:gap-1">
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
              style={boxStyle("var(--color-final)", c.id === finalId, !c.common)}
              className={cn(boxCls(c.id === finalId), "grid size-10 text-xl xl:size-9")}
            >
              {c.char}
            </button>
          ))}
      </div>
    </div>
  );

  return (
    <div ref={ref} className="rounded-2xl border border-ink/10 p-3 md:p-4">
      <div
        className="mb-3 flex gap-1 overflow-x-auto rounded-xl bg-paper-deep p-1 xl:hidden"
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
              "min-h-11 flex-1 whitespace-nowrap rounded-lg px-2 py-2 text-xs font-medium focus-visible:outline-2 focus-visible:outline-ink sm:px-3 sm:text-sm md:px-1.5 md:text-xs min-[900px]:px-3 min-[900px]:text-sm xl:px-3",
              tab === k ? "bg-ink text-paper" : "hover:bg-ink/10",
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
          extra={(["all", "mid", "high", "low"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCls(c)}
              aria-pressed={cls === c}
              className={cn(
                pill(cls === c),
                cls === c &&
                  c !== "all" &&
                  `${CLASS_META[c].bg} text-on-accent`,
              )}
            >
              {c === "all"
                ? t.builder.filters.all
                : CLASS_META[c].label[locale]}
            </button>
          ))}
        >
          <div>
            {(["single", "cluster", "leading"] as const).map((r) =>
              rows[r].length ? (
                <div key={r}>
                  {r !== "single" && (
                    <p className="relative mb-1.5 mt-2.5 border-t border-dashed border-ink/15">
                      <span className="absolute -top-2 left-0 bg-paper pr-2 text-[10px] font-medium leading-none text-ink-soft">
                        {t.builder.rows[r]}
                      </span>
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5 xl:gap-1">
                    {rows[r].map(initialTile)}
                  </div>
                </div>
              ) : null,
            )}
          </div>
        </Group>

        {/* Nguyên âm, dấu thanh xếp ngay bên dưới */}
        <div className="contents xl:block xl:space-y-3">
          <Group k="vowel" tab={tab} title={t.builder.parts.vowel}>
            <div className="flex flex-wrap gap-1.5 xl:gap-1">
              {vowels.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  data-tile
                  data-kind="vowel"
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
            </div>
          </Group>

          <Group k="mark" tab={tab} title={t.builder.parts.mark}>
            <div className="flex flex-wrap gap-1.5 xl:gap-1">
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
                    <span className="font-thai text-2xl leading-none">
                      {HOLDER}
                      {m.char}
                    </span>
                    {showPhonetic && (
                      <span className="text-left font-sans text-[10px] leading-tight">
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
              {t.builder.noFinal}
            </button>
          }
        >
          {!vowel.closed && (
            <p className="mb-1.5 text-xs text-high">{t.builder.vowelNoFinal}</p>
          )}
          <div className="space-y-2">
            <div>
              <p className="mb-1 text-[11px] font-medium text-ink-soft">
                {t.builder.stopGroup}
              </p>
              <div className="space-y-1">{STOPS.map(finalRow)}</div>
            </div>
            <div className="border-t border-dashed border-ink/15 pt-1.5">
              <p className="mb-1 text-[11px] font-medium text-ink-soft">
                {t.builder.sonorantGroup}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                {SONORANTS.map((snd) => (
                  <div key={snd} className="flex items-center gap-1">
                    <span className="font-ipa text-sm text-ink-soft">
                      /{snd}/
                    </span>
                    {finals
                      .filter((c) => c.final === snd)
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
                          style={boxStyle("var(--color-final)", c.id === finalId, !c.common)}
                          className={cn(boxCls(c.id === finalId), "grid size-10 text-xl xl:size-9")}
                        >
                          {c.char}
                        </button>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Group>
      </div>
    </div>
  );
}
