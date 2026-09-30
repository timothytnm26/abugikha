"use client";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  CLASS_META,
  type Consonant,
  type InitialUnit,
} from "@/entities/consonant";
import { vowelGlyph, type Vowel } from "@/entities/vowel";
import {
  RuleBreakdown,
  SyllableGlyph,
  ToneContour,
  TONE_MARK_BY_ID,
  TONE_META,
  analyzeSyllable,
  type RuleStep,
  type SyllableAnalysis,
} from "@/entities/syllable";
import type { Word, WordMatches } from "@/entities/lexicon";
import { useBuilderStore, type PartKind } from "@/features/build-syllable";
import { useLocale, useT } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { gsap, useGSAP, prefersReducedMotion } from "@/shared/lib/gsap";
import { speakThai } from "@/shared/lib/speech";
import { Phonetic, SpeakButton } from "@/shared/ui";
import { tint } from "@/shared/lib";

interface Props {
  analysis: SyllableAnalysis;
  initial: InitialUnit;
  vowel: Vowel;
  final: Consonant | null;
  words: WordMatches;
}

type Align = "start" | "center" | "end";

/** Popover hiện khi hover/focus: âm tiết tại bước đó + giải thích. */
function StepPopover({
  title,
  glyph,
  ipa,
  tone,
  steps,
  extra,
  align,
}: {
  title: string;
  glyph: string;
  ipa?: string;
  tone?: string;
  steps: RuleStep[];
  extra?: ReactNode;
  align: Align;
}) {
  const t = useT();
  return (
    <div
      role="tooltip"
      className={cn(
        // display:none khi ẩn để không làm trang tràn ngang trên mobile
        "pointer-events-none absolute top-full z-30 mt-3 hidden w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-ink/10 bg-paper p-4 text-left shadow-2xl [animation:pop-in_.15s_ease-out]",
        "group-hover/step:block group-focus-within/step:block",
        align === "start"
          ? "left-0"
          : align === "end"
            ? "right-0"
            : "left-1/2 -translate-x-1/2",
      )}
    >
      <p className="text-[11px] font-medium uppercase tracking-wide text-ink-soft">
        {title}
      </p>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="font-thai text-4xl leading-tight">{glyph}</span>
        {ipa && (
          <Phonetic
            ipa={ipa}
            className="text-sm"
            style={tone ? { color: tone } : undefined}
          />
        )}
      </div>
      <div className="mt-3 space-y-2.5">
        {steps.map((s, i) => (
          <div key={i}>
            <p
              className="text-sm font-semibold leading-snug"
              style={s.color ? { color: s.color } : undefined}
            >
              {s.title}
            </p>
            <p className="text-xs leading-relaxed text-ink/75">{s.detail}</p>
          </div>
        ))}
        {extra}
      </div>
    </div>
  );
}

function Slot({
  kind,
  label,
  glyph,
  color,
  empty,
  onSelect,
  onClear,
  clearLabel,
  small,
  popover,
  hint,
}: {
  kind: PartKind;
  label: string;
  glyph: string;
  color?: string;
  empty?: boolean;
  small?: boolean;
  hint?: string;
  onSelect: () => void;
  onClear?: () => void;
  clearLabel?: string;
  popover?: ReactNode;
}) {
  return (
    <div className="group/step relative flex flex-col items-center gap-1">
      <button
        type="button"
        data-slot={kind}
        onClick={onSelect}
        title={small ? undefined : hint}
        aria-label={`${label}: ${empty ? "—" : glyph}`}
        className={cn(
          "relative grid place-items-center rounded-xl border-2 font-thai focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
          small
            ? "h-11 min-w-11 px-1.5 text-2xl"
            : "h-14 min-w-13 px-2 text-3xl sm:min-w-14 xl:h-16 xl:min-w-16",
          empty ? "border-dashed border-ink/25 text-ink-soft" : "bg-sheet",
        )}
        style={!empty && color ? { borderColor: color, color, backgroundColor: tint(color, 10) } : undefined}
      >
        {glyph}
      </button>
      {!small && <span className="max-w-20 text-center text-[10px] font-medium leading-tight text-ink-soft">{label}</span>}
      {onClear && !empty && !small && (
        <button
          type="button"
          onClick={onClear}
          aria-label={clearLabel}
          className="absolute -right-2 -top-2 z-10 grid size-6 place-items-center rounded-full bg-ink text-xs leading-none text-paper hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink pointer-coarse:size-7"
        >
          ×
        </button>
      )}
      {popover}
    </div>
  );
}

const Plus = ({ c = "+", compact }: { c?: string; compact?: boolean }) => (
  <span className={cn("text-xl text-ink-soft", compact ? "hidden sm:inline" : "-mt-4")} aria-hidden>
    {c}
  </span>
);

function WordLine({ word }: { word: Word }) {
  const { locale } = useLocale();
  return (
    <div className="flex items-center gap-2.5 px-1">
      <span className="font-thai text-xl leading-snug">{word.thai}</span>
      <Phonetic ipa={word.ipa} className="text-xs text-ink-soft" />
      <span className="min-w-0 flex-1 truncate text-sm">
        {word.meaning[locale]}
      </span>
      <SpeakButton text={word.thai} label="" className="px-2 py-0.5" />
    </div>
  );
}

function CompoundChip({ word, highlight }: { word: Word; highlight: string }) {
  const { locale } = useLocale();
  return (
    <li>
      <button
        type="button"
        onClick={() => speakThai(word.thai)}
        title={`/${word.ipa}/`}
        className="flex items-baseline gap-1.5 rounded-md bg-paper/70 px-2 py-0.5 text-xs hover:bg-paper focus-visible:outline-2 focus-visible:outline-ink"
      >
        <span className="font-thai text-base">
          {word.parts!.map((p, i) => (
            <span
              key={i}
              className={
                p === highlight
                  ? "font-semibold underline decoration-2 underline-offset-4"
                  : undefined
              }
            >
              {p}
            </span>
          ))}
        </span>
        <span className="text-ink-soft">{word.meaning[locale]}</span>
      </button>
    </li>
  );
}

/** Khung ghép: mỗi ô là một bước của tiến trình (hover để xem), từ vựng ở dưới đường đứt. */
export const SumStage = forwardRef<HTMLDivElement, Props>(function SumStage(
  { analysis: a, initial, vowel, final, words },
  ref,
) {
  const t = useT();
  const { locale } = useLocale();
  const { setTab, setPart, pulse, lastKind } = useBuilderStore();
  const inner = useRef<HTMLDivElement>(null);
  const tone = TONE_META[a.tone];
  const clsColor = CLASS_META[a.cls].color;
  const markChar = a.mark ? TONE_MARK_BY_ID.get(a.mark)!.char : null;
  const hasFinal = Boolean(final) && !a.finalDropped;

  // Âm tiết "tại thời điểm" của từng bước
  const stages = useMemo(() => {
    const withVowel = analyzeSyllable({ initial, vowel }, locale);
    const withFinal = analyzeSyllable(
      { initial, vowel, final: hasFinal ? final : null },
      locale,
    );
    return { withVowel, withFinal };
  }, [initial, vowel, final, hasFinal, locale]);
  const stepsOf = (...kinds: RuleStep["kind"][]) =>
    a.steps.filter((s) => kinds.includes(s.kind));
  const vowelSteps: RuleStep[] = [
    ...stepsOf("vowel"),
    {
      kind: "vowel",
      title: `/${vowel.ipa}/ · ${vowel.length === "long" ? t.syllable.long : t.syllable.short}`,
      detail: `≈ ${vowel.approx[locale]}`,
    },
    {
      kind: "vowel",
      title: t.syllable.placement(
        a.placements.map((p) => t.syllable.where[p]).join(" + "),
        initial.chars,
      ),
      detail: a.placements.includes("before")
        ? t.syllable.placementBefore(initial.chars).trim()
        : "",
    },
  ];

  const section = useRef<HTMLElement>(null);
  useImperativeHandle(ref, () => section.current as HTMLDivElement);
  const [offscreen, setOffscreen] = useState(false);
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    // Hiện thanh nổi khi khung chính bị che quá nửa ở phía trên (56px = chiều cao nav)
    const io = new IntersectionObserver(
      ([e]) =>
        setOffscreen(
          e.intersectionRatio < 0.5 && e.boundingClientRect.top < 56,
        ),
      {
        rootMargin: "-56px 0px 0px 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      if (!pulse || prefersReducedMotion()) return;
      const tl = gsap.timeline();
      if (lastKind)
        tl.fromTo(
          `[data-slot="${lastKind}"]`,
          { scale: 1.25 },
          { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" },
          0,
        );
      tl.fromTo(
        ".sum-result",
        { scale: 0.75, rotate: -5 },
        { scale: 1, rotate: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" },
        0.1,
      )
        .fromTo(
          ".sum-ring",
          { scale: 0.5, opacity: 0.8 },
          {
            scale: 2,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power2.out",
          },
          0.1,
        )
        .fromTo(
          ".vocab",
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.3 },
          0.2,
        );
    },
    { scope: inner, dependencies: [pulse] },
  );

  const slots = (small: boolean) => (
    <>
      <Slot
        hint={t.builder.hoverHint}
        small={small}
        kind="initial"
        label={t.builder.parts.initial}
        glyph={initial.chars}
        color={clsColor}
        onSelect={() => setTab("initial")}
        popover={
          !small && (
            <StepPopover
              align="start"
              title={t.builder.parts.initial}
              glyph={initial.chars}
              ipa={initial.ipa}
              steps={stepsOf("class")}
            />
          )
        }
      />
      <Plus compact={small} />
      <Slot
        hint={t.builder.hoverHint}
        small={small}
        kind="vowel"
        label={t.builder.parts.vowel}
        glyph={vowelGlyph(vowel, a.form)}
        color="var(--color-vowel)"
        onSelect={() => setTab("vowel")}
        popover={
          !small && (
            <StepPopover
              align="center"
              title={t.builder.parts.vowel}
              glyph={stages.withVowel.spelling}
              ipa={stages.withVowel.ipa}
              tone={TONE_META[stages.withVowel.tone].color}
              steps={vowelSteps}
            />
          )
        }
      />
      <Plus compact={small} />
      <Slot
        hint={t.builder.hoverHint}
        small={small}
        kind="final"
        label={t.builder.parts.final}
        glyph={hasFinal ? final!.char : "—"}
        color="var(--color-final)"
        empty={!hasFinal}
        onSelect={() => setTab("final")}
        onClear={() => setPart("final", null)}
        clearLabel={t.builder.clearPart(t.builder.parts.final)}
        popover={
          !small && (
            <StepPopover
              align="center"
              title={hasFinal ? t.builder.parts.final : t.builder.noFinalStep}
              glyph={stages.withFinal.spelling}
              ipa={stages.withFinal.ipa}
              tone={TONE_META[stages.withFinal.tone].color}
              steps={stepsOf("final", "liveness")}
            />
          )
        }
      />
      <Plus compact={small} />
      <Slot
        hint={t.builder.hoverHint}
        small={small}
        kind="mark"
        label={t.builder.parts.mark}
        glyph={markChar ? `◌${markChar}` : "—"}
        color={tone.color}
        empty={!markChar}
        onSelect={() => setTab("mark")}
        onClear={() => setPart("mark", null)}
        clearLabel={t.builder.clearPart(t.builder.parts.mark)}
        popover={
          !small && (
            <StepPopover
              align="end"
              title={markChar ? t.builder.parts.mark : t.builder.noMarkStep}
              glyph={a.spelling}
              ipa={a.ipa}
              tone={tone.color}
              steps={stepsOf("mark", "result")}
            />
          )
        }
      />
    </>
  );

  return (
    <>
      <section
        ref={section}
        data-tape
        data-fold
        aria-label={t.builder.sumAria}
        className="note-paper rounded-2xl px-3 pb-3 pt-6 sm:px-5 md:px-6"
      >
        <div ref={inner}>
          {/* Đầu tờ giấy: tên khung + nút nghe, giống khung xem trước ở trang Abugida */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">
              {t.builder.previewTitle}
            </span>
            <SpeakButton text={a.spelling} className="bg-sheet" />
          </div>

          {/* Âm tiết lớn */}
          <div className="group/step relative grid place-items-center py-2">
            <span
              className="sum-ring pointer-events-none absolute size-32 rounded-full border-2 opacity-0"
              style={{ borderColor: tone.color }}
            />
            <button
              type="button"
              onClick={() => speakThai(a.spelling)}
              aria-label={`${a.spelling}, ${t.builder.resultHint}`}
              className="sum-result relative rounded-2xl px-6 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              <SyllableGlyph
                analysis={a}
                className="note-glyph block text-[clamp(5.5rem,26vw,9rem)] leading-[1.35]"
              />
              {a.warnings.length > 0 && (
                <span
                  className="absolute -left-1 top-1 grid size-6 place-items-center rounded-full bg-high text-xs font-bold text-on-accent"
                  aria-hidden
                >
                  !
                </span>
              )}
            </button>
            <StepPopover
              align="center"
              title={t.builder.resultStep}
              glyph={a.spelling}
              ipa={a.ipa}
              tone={tone.color}
              steps={stepsOf("result")}
              extra={
                <p className="text-xs text-ink-soft">
                  <span style={{ color: clsColor }}>
                    {t.builder.formula.cls(CLASS_META[a.cls].label[locale])}
                  </span>
                  {" + "}
                  {a.liveness === "live"
                    ? t.builder.formula.live
                    : t.builder.formula.dead}
                  {!a.mark && a.liveness === "dead" && a.cls === "low" && (
                    <>
                      {" + "}
                      {a.length === "long"
                        ? t.builder.formula.long
                        : t.builder.formula.short}
                    </>
                  )}
                  {" + "}
                  {a.mark ? (
                    <span className="font-thai">◌{markChar}</span>
                  ) : (
                    t.builder.noMark
                  )}
                </p>
              }
            />
          </div>

          {/* Phiên âm + thanh + nhóm */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <Phonetic ipa={a.ipa} className="text-xl" style={{ color: tone.color }} />
            <ToneContour tone={a.tone} className="w-9" strokeWidth={4} />
            <ul className="flex flex-wrap items-center justify-center gap-1.5 text-xs font-medium">
              <li
                className="rounded-full px-2.5 py-0.5 text-on-accent"
                style={{ backgroundColor: clsColor }}
              >
                {t.builder.formula.cls(CLASS_META[a.cls].label[locale])}
              </li>
              <li className="rounded-full bg-ink/8 px-2.5 py-0.5">
                {a.liveness === "live" ? t.builder.formula.live : t.builder.formula.dead}
              </li>
              <li
                className="rounded-full px-2.5 py-0.5"
                style={{ backgroundColor: tint(tone.color, 18), color: tone.color }}
              >
                {t.builder.toneLabel} {tone.label[locale]}
              </li>
            </ul>
          </div>

          {a.warnings.length > 0 && (
            <ul className="mt-2 space-y-0.5 text-center text-xs text-high" aria-live="polite">
              {a.warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          )}

          {/* Nửa dưới là phần điều khiển nên nền trơn (không kẻ) để chữ nhỏ không bị đường kẻ cắt ngang */}
          <div className="-mx-3 -mb-3 mt-5 rounded-b-2xl border-t-2 border-dashed border-ink/15 bg-sheet px-3 pb-3 pt-4 sm:-mx-5 sm:px-5 md:-mx-6 md:px-6">
          {/* Phương trình các mảnh ghép */}
          <div className="flex flex-wrap items-start justify-center gap-x-1.5 gap-y-2 sm:gap-x-2 xl:gap-x-3">
            {slots(false)}
          </div>
          <p className="mt-2 text-center text-[11px] text-ink-soft">
            <span className="hidden pointer-fine:inline">{t.builder.hoverHint}</span>
            <span className="pointer-fine:hidden">{t.builder.tapHint}</span>
          </p>

          {/* Từ vựng */}
          <div
            className="vocab mt-3 space-y-1 border-t border-dashed border-ink/15 pt-2"
            aria-live="polite"
          >
            {words.exact ? (
              <>
                <WordLine word={words.exact} />
                {words.exact.ipa.normalize("NFC") !== a.ipa && (
                  <p className="px-1 text-xs text-high">
                    {t.builder.irregular(words.exact.ipa)}
                  </p>
                )}
              </>
            ) : (
              !words.compounds.length && (
                <p className="px-1 text-sm" title={t.builder.notWordBody}>
                  <span className="font-thai text-lg">{a.spelling}</span>{" "}
                  <span className="font-medium">
                    · {t.builder.notWordTitle}
                  </span>
                </p>
              )
            )}
            {words.compounds.length > 0 && (
              <ul className="flex flex-wrap items-center gap-1 px-1 pb-1">
                <li className="mr-1 text-[11px] font-medium text-ink-soft">
                  {t.builder.inWords}
                </li>
                {words.compounds.map((w) => (
                  <CompoundChip key={w.thai} word={w} highlight={a.spelling} />
                ))}
              </ul>
            )}
          </div>

          {/* Máy cảm ứng không có hover: các bước suy ra thanh nằm sẵn trong mục mở được này */}
          <details className="group mt-2 rounded-xl bg-paper-deep/70 px-3 py-2">
            <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-ink">
              {t.builder.stepsToggle}
              <svg aria-hidden viewBox="0 0 20 20" className="size-4 fill-none stroke-current stroke-2 transition-transform group-open:rotate-180" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 8l5 5 5-5" />
              </svg>
            </summary>
            <div className="pb-2 pt-3">
              <RuleBreakdown analysis={a} />
            </div>
          </details>
          </div>
        </div>
      </section>

      {/* Thanh ghép nổi: hiện khi khung chính bị cuộn khuất, nhận thả như khung chính */}
      {offscreen && (
        <div className="pointer-events-none fixed inset-x-0 top-[3.75rem] z-30 flex justify-center px-2 sm:px-4 md:top-[4.25rem]">
          <div
            data-dropzone="dock"
            aria-label={t.builder.sumAria}
            className="pointer-events-auto flex items-center gap-1.5 rounded-2xl border-2 bg-paper px-2.5 py-2 shadow-[0_24px_60px_-18px_rgb(0_0_0/0.55)] [animation:dock-in_.3s_cubic-bezier(.2,1.4,.4,1)] sm:gap-2.5 sm:px-4 sm:py-2.5"
            style={{
              borderColor: `color-mix(in oklab, ${clsColor} 55%, transparent)`,
            }}
          >
            {slots(true)}
            <Plus c="=" />
            <button
              type="button"
              onClick={() => speakThai(a.spelling)}
              className="flex items-center self-stretch rounded-xl border-2 bg-sheet px-3 focus-visible:outline-2 focus-visible:outline-ink"
              style={{
                borderColor: tone.color,
              }}
              aria-label={`${a.spelling}, ${t.builder.resultHint}`}
            >
              <SyllableGlyph analysis={a} className="text-3xl leading-none" />
            </button>
          </div>
        </div>
      )}
    </>
  );
});
