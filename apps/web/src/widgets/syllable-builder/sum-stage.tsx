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
  SyllableCard,
  SyllableGlyph,
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
import { paletteVar } from "@/shared/config/palette";
import { gsap, useGSAP, prefersReducedMotion } from "@/shared/lib/gsap";
import { speakThai } from "@/shared/lib/speech";
import { Phonetic, SpeakButton } from "@/shared/ui";

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
              style={s.accent ? { color: paletteVar(s.accent) } : undefined}
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
    <div
      className={cn(
        "group/step relative flex flex-col items-center gap-1.5",
        kind === "mark" && !small && "ml-2",
      )}
    >
      <button
        type="button"
        data-slot={kind}
        onClick={onSelect}
        title={small ? undefined : hint}
        aria-label={`${label}: ${empty ? "—" : glyph}`}
        className={cn(
          "relative grid place-items-center rounded-lg border-2 font-thai focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
          small
            ? "h-11 min-w-11 px-1.5 text-2xl"
            : "h-14 min-w-14 px-2 text-3xl md:h-16 md:min-w-16",
          empty
            ? "border-dashed border-ink/25 text-ink-soft"
            : "border-transparent bg-paper",
        )}
        style={!empty && color ? { borderColor: color, color } : undefined}
      >
        {glyph}
      </button>
      {onClear && !empty && !small && (
        <button
          type="button"
          onClick={onClear}
          aria-label={clearLabel}
          className="absolute -right-2 -top-2 z-10 grid size-5 place-items-center rounded-full bg-ink text-xs leading-none text-paper hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          ×
        </button>
      )}
      {popover}
    </div>
  );
}

const Plus = ({ c = "+" }: { c?: string }) => (
  <span className="text-xl text-ink-soft" aria-hidden>
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
      <Plus />
      <Slot
        hint={t.builder.hoverHint}
        small={small}
        kind="vowel"
        label={t.builder.parts.vowel}
        glyph={vowelGlyph(vowel, a.form)}
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
      <Plus />
      <Slot
        hint={t.builder.hoverHint}
        small={small}
        kind="final"
        label={t.builder.parts.final}
        glyph={hasFinal ? final!.char : "—"}
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
      <Plus />
      <Slot
        hint={t.builder.hoverHint}
        small={small}
        kind="mark"
        label={t.builder.parts.mark}
        glyph={markChar ? `◌${markChar}` : "—"}
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
        aria-label={t.builder.sumAria}
        className="rounded-xl bg-paper-deep px-3 pb-2 pt-4 md:px-4"
      >
        <div ref={inner}>
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {slots(false)}
            <Plus c="=" />
            <div className="group/step relative grid place-items-center">
              <span
                className="sum-ring pointer-events-none absolute size-28 rounded-full border-2 opacity-0"
                style={{ borderColor: tone.color }}
              />
              <button
                type="button"
                onClick={() => speakThai(a.spelling)}
                aria-label={`${a.spelling}, ${t.builder.resultHint}`}
                className="sum-result relative rounded-xl focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink"
              >
                <SyllableCard analysis={a} size="lg" />
                {a.warnings.length > 0 && (
                  <span
                    className="absolute -left-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-high text-xs font-bold text-on-accent"
                    aria-hidden
                  >
                    !
                  </span>
                )}
              </button>
              <StepPopover
                align="end"
                title={t.builder.resultStep}
                glyph={a.spelling}
                ipa={a.ipa}
                tone={tone.color}
                steps={stepsOf("result")}
                extra={
                  <>
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
                          {" "}
                          +{" "}
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
                    {a.warnings.map((w) => (
                      <p key={w} className="text-xs text-high">
                        {w}
                      </p>
                    ))}
                  </>
                }
              />
            </div>
          </div>

          {/* Từ vựng */}
          <div
            className="vocab mt-3 space-y-1 border-t-2 border-dashed border-ink/15 pt-1.5"
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
        </div>
      </section>

      {/* Thanh ghép nổi: hiện khi khung chính bị cuộn khuất, nhận thả như khung chính */}
      {offscreen && (
        <div className="pointer-events-none fixed inset-x-0 top-[4.25rem] z-30 hidden justify-center px-4 md:flex">
          <div
            data-dropzone="dock"
            aria-label={t.builder.sumAria}
            className="pointer-events-auto flex items-center gap-2.5 rounded-xl border-2 bg-paper px-4 py-2.5 shadow-[0_24px_60px_-18px_rgb(0_0_0/0.55)] [animation:dock-in_.3s_cubic-bezier(.2,1.4,.4,1)]"
            style={{
              borderColor: `color-mix(in oklab, ${clsColor} 55%, transparent)`,
            }}
          >
            {slots(true)}
            <Plus c="=" />
            <button
              type="button"
              onClick={() => speakThai(a.spelling)}
              className="flex items-center self-stretch rounded-xl border-2 bg-paper px-3 focus-visible:outline-2 focus-visible:outline-ink"
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
