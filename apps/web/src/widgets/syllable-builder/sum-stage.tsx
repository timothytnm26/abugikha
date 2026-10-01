"use client";
import Link from "next/link";
import {
  forwardRef,
  useEffect,
  useId,
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
import { AutoSpeakSwitch } from "@/features/customize-appearance";
import { MORPH_BY_VOWEL, MORPH_RULES } from "@abugikha/core/syllable";
import { fmt, useLocale, useLocalePath, useT } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { paletteVar } from "@/shared/config/palette";
import { gsap, useGSAP, prefersReducedMotion } from "@/shared/lib/gsap";
import { speakThai } from "@/shared/lib/speech";
import { Phonetic, SpeakButton } from "@/shared/ui";
import { FLY_FROM, Notebook, type Cell } from "./notebook";

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
  id,
  title,
  glyph,
  ipa,
  tone,
  steps,
  extra,
  align,
}: {
  id: string;
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
      id={id}
      role="tooltip"
      className={cn(
        // display:none khi ẩn để không làm trang tràn ngang trên mobile. Lớp đệm pt-3 nối trigger với thẻ để rê chuột
        // sang thẻ mà không mất hover (WCAG 1.4.13: rê được, không biến mất khi chuột đi chuyển)
        "absolute top-full z-30 hidden w-72 max-w-[calc(100vw-2rem)] pt-3 text-left",
        "group-hover/step:block group-focus-within/step:block",
        align === "start"
          ? "left-0"
          : align === "end"
            ? "right-0"
            : "left-1/2 -translate-x-1/2",
      )}
    >
      <div className="rounded-xl border border-ink/10 bg-paper p-4 shadow-2xl [animation:pop-in_.15s_ease-out]">
      <p className="text-[11px] font-medium uppercase tracking-wide text-ink-soft">
        {title}
      </p>
      <div className="mt-2 flex items-baseline gap-3">
        <span lang="th" className="font-thai text-4xl leading-tight">{glyph}</span>
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
    </div>
  );
}

/** Ô nhỏ của thanh ghép nổi (vẫn là đích thả khi kéo) */
function DockSlot({
  kind,
  label,
  glyph,
  color,
  empty,
  onSelect,
}: {
  kind: PartKind;
  label: string;
  glyph: string;
  color?: string;
  empty?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      data-slot={kind}
      onClick={onSelect}
      aria-label={`${label}: ${empty ? "—" : glyph}`}
      className={cn(
        "relative grid h-11 min-w-11 place-items-center rounded-lg border-2 px-1.5 font-thai text-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
        empty ? "border-dashed border-ink/55 text-ink-soft" : "border-transparent bg-paper",
      )}
      style={!empty && color ? { borderColor: color, color } : undefined}
    >
      <span lang="th">{glyph}</span>
    </button>
  );
}

const Plus = ({ c = "+", compact }: { c?: string; compact?: boolean }) => (
  <span className={cn("text-xl text-ink-soft", compact && "hidden sm:inline")} aria-hidden>
    {c}
  </span>
);

function WordLine({ word }: { word: Word }) {
  const { locale } = useLocale();
  return (
    <div className="flex items-center gap-2.5 px-1">
      <span lang="th" className="font-thai text-xl leading-snug">{word.thai}</span>
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
        <span lang="th" className="font-thai text-base">
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
  const href = useLocalePath();
  const { setTab, setPart, pulse, lastKind } = useBuilderStore();
  const inner = useRef<HTMLDivElement>(null);
  const resultPopId = useId();
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
      title: fmt(t.syllable.placement, { sides: a.placements.map((p) => t.syllable.where[p]).join(" + "), initial: initial.chars }),
      detail: a.placements.includes("before")
        ? fmt(t.syllable.placementBefore, { initial: initial.chars }).trim()
        : "",
    },
  ];

  const section = useRef<HTMLElement>(null);
  useImperativeHandle(ref, () => section.current as HTMLDivElement);
  const [offscreen, setOffscreen] = useState(false);
  // Esc ẩn các thẻ giải thích đang mở (WCAG 1.4.13); lần rê chuột hoặc đổi focus kế tiếp cho chúng hiện lại
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const hide = (e: KeyboardEvent) => {
      if (e.key === "Escape") el.dataset.esc = "";
    };
    const show = () => delete el.dataset.esc;
    document.addEventListener("keydown", hide);
    el.addEventListener("pointermove", show);
    el.addEventListener("focusin", show);
    return () => {
      document.removeEventListener("keydown", hide);
      el.removeEventListener("pointermove", show);
      el.removeEventListener("focusin", show);
    };
  }, []);
  // Máy cảm ứng không có hover: mục "Vì sao ra thanh này?" mở sẵn
  const [whyOpen, setWhyOpen] = useState(false);
  useEffect(() => setWhyOpen(matchMedia("(hover: none)").matches), []);
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
      if (lastKind) {
        const pieces = gsap.utils.toArray<HTMLElement>(`[data-part="${lastKind}"] [data-piece]`, inner.current);
        const em = (el: HTMLElement) => parseFloat(getComputedStyle(el.closest("[data-cell]")!).fontSize) || 60;
        const fly = (el: HTMLElement) => FLY_FROM[(el.closest("[data-cell]") as HTMLElement).dataset.cell as Cell];
        tl.fromTo(
          pieces,
          {
            x: (_: number, el: HTMLElement) => fly(el)[0] * em(el),
            y: (_: number, el: HTMLElement) => fly(el)[1] * em(el),
            scale: lastKind === "initial" ? 0.4 : 0.75,
            opacity: 0,
          },
          { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.55, ease: "back.out(1.6)", stagger: 0.05 },
          0,
        );
      }
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

  const popovers: Record<PartKind, (align: Align, id: string) => ReactNode> = {
    initial: (align, id) => (
      <StepPopover id={id} align={align} title={t.builder.parts.initial} glyph={initial.chars} ipa={initial.ipa} steps={stepsOf("class")} />
    ),
    vowel: (align, id) => (
      <StepPopover
        id={id}
        align={align}
        title={t.builder.parts.vowel}
        glyph={stages.withVowel.spelling}
        ipa={stages.withVowel.ipa}
        tone={TONE_META[stages.withVowel.tone].color}
        steps={vowelSteps}
      />
    ),
    final: (align, id) => (
      <StepPopover
        id={id}
        align={align}
        title={hasFinal ? t.builder.parts.final : t.builder.noFinalStep}
        glyph={stages.withFinal.spelling}
        ipa={stages.withFinal.ipa}
        tone={TONE_META[stages.withFinal.tone].color}
        steps={stepsOf("final", "liveness")}
      />
    ),
    mark: (align, id) => (
      <StepPopover
        id={id}
        align={align}
        title={markChar ? t.builder.parts.mark : t.builder.noMarkStep}
        glyph={a.spelling}
        ipa={a.ipa}
        tone={tone.color}
        steps={stepsOf("mark", "result")}
      />
    ),
  };

  // Liên kết sang minh hoạ "nguyên âm biến hình" ở trang Aksorn Thai
  const morphId =
    a.form === "closed"
      ? vowel.id === "ooe" && final?.char === "ย"
        ? "ooe-y"
        : MORPH_BY_VOWEL.get(vowel.id)?.id
      : undefined;
  const taikhu = Boolean(a.mark) && (a.form === "closed" ? vowel.closed : vowel.open)?.includes("็");
  const notes: { id: string; text: string }[] = [];
  if (morphId && MORPH_RULES.find((r) => r.id === morphId)?.group !== "compound")
    notes.push({ id: morphId, text: fmt(t.notebook.morphed, { from: vowelGlyph(vowel, "open"), to: a.spelling }) });
  if (taikhu) notes.push({ id: "taikhu", text: t.notebook.taikhu });

  const dockSlots = (
    <>
      <DockSlot kind="initial" label={t.builder.parts.initial} glyph={initial.chars} color={clsColor} onSelect={() => setTab("initial")} />
      <Plus compact />
      <DockSlot kind="vowel" label={t.builder.parts.vowel} glyph={vowelGlyph(vowel, a.form)} color="var(--color-part-vowel)" onSelect={() => setTab("vowel")} />
      <Plus compact />
      <DockSlot
        kind="final"
        label={t.builder.parts.final}
        glyph={hasFinal ? final!.char : "—"}
        color="var(--color-part-final)"
        empty={!hasFinal}
        onSelect={() => setTab("final")}
      />
      <Plus compact />
      <DockSlot
        kind="mark"
        label={t.builder.parts.mark}
        glyph={markChar ? `◌${markChar}` : "—"}
        color={tone.color}
        empty={!markChar}
        onSelect={() => setTab("mark")}
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
          {/* Thông báo âm tiết vừa ghép và thanh của nó cho trình đọc màn hình */}
          <p role="status" className="sr-only">
            {`${a.spelling}, /${a.ipa}/, ${tone.label[locale]}`}
          </p>
          <div className="flex flex-col items-stretch gap-3 xl:flex-row xl:items-center">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-1 text-[11px] text-ink-soft">
                <span className="font-semibold uppercase tracking-wider">{t.notebook.title}</span>
                <span className="flex items-center gap-3">
                  <span className="hidden pointer-fine:inline">{t.builder.hoverHint}</span>
                  <span className="pointer-fine:hidden">{t.builder.tapHint}</span>
                  <AutoSpeakSwitch label={t.builder.autoSpeak} className="text-ink" />
                </span>
              </div>
              <Notebook
                analysis={a}
                classColor={clsColor}
                toneColor={tone.color}
                liveLabel={a.liveness === "live" ? t.syllable.live : t.syllable.dead}
                multiInitial={initial.chars.length > 1}
                onSelect={setTab}
                onClear={(k) => setPart(k, null)}
                clearLabel={(k) => fmt(t.builder.clearPart, { part: t.builder.parts[k] })}
                labels={t.builder.parts}
                popovers={popovers}
              />
            </div>
            <Plus c="=" />
            <div className="group/step relative grid place-items-center self-center">
              <span
                className="sum-ring pointer-events-none absolute size-28 rounded-full border-2 opacity-0"
                style={{ borderColor: tone.color }}
              />
              <button
                type="button"
                onClick={() => speakThai(a.spelling)}
                aria-label={`${a.spelling}, ${t.builder.resultHint}${a.warnings.length ? `. ${a.warnings.join(" ")}` : ""}`}
                aria-describedby={resultPopId}
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
                id={resultPopId}
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
                        {fmt(t.builder.formula.cls, { cls: CLASS_META[a.cls].label[locale] })}
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
                        <span lang="th" className="font-thai">◌{markChar}</span>
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

          {a.warnings.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {a.warnings.map((w) => (
                <li key={w} className="flex gap-2 rounded-lg bg-paper px-3 py-2 text-sm text-high">
                  <span aria-hidden className="font-bold">!</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          )}

          {notes.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {notes.map((n) => (
                <li key={n.id} className="flex flex-wrap items-baseline gap-x-2 rounded-lg bg-paper px-3 py-2 text-sm">
                  <span>{n.text}</span>
                  <Link href={`${href("/aksornthai")}#morph-${n.id}`} className="font-medium underline underline-offset-4 hover:no-underline">
                    {t.notebook.seeMorph} →
                  </Link>
                </li>
              ))}
            </ul>
          )}

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
                    {fmt(t.builder.irregular, { ipa: words.exact.ipa })}
                  </p>
                )}
              </>
            ) : (
              !words.compounds.length && (
                <p className="px-1 text-sm" title={t.builder.notWordBody}>
                  <span lang="th" className="font-thai text-lg">{a.spelling}</span>{" "}
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

          {/* Các bước suy ra thanh luôn nằm sẵn trong mục mở được này (mở sẵn trên máy cảm ứng) */}
          <details className="group mt-2 rounded-xl bg-paper/60 px-3 py-2" open={whyOpen} onToggle={(e) => setWhyOpen(e.currentTarget.open)}>
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
      </section>

      {/* Thanh ghép nổi: hiện khi khung chính bị cuộn khuất, nhận thả như khung chính */}
      {offscreen && (
        <div className="pointer-events-none fixed inset-x-0 top-[3.75rem] z-30 flex justify-center px-2 sm:px-4 md:top-[4.25rem]">
          <div
            data-dropzone="dock"
            role="group"
            aria-label={t.builder.sumAria}
            className="pointer-events-auto flex items-center gap-1.5 rounded-xl border-2 bg-paper px-2.5 py-2 shadow-[0_24px_60px_-18px_rgb(0_0_0/0.55)] [animation:dock-in_.3s_cubic-bezier(.2,1.4,.4,1)] sm:gap-2.5 sm:px-4 sm:py-2.5"
            style={{
              borderColor: `color-mix(in oklab, ${clsColor} 55%, transparent)`,
            }}
          >
            {dockSlots}
            <Plus c="=" compact />
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
