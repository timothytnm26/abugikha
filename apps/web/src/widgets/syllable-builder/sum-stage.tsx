"use client";
import Link from "next/link";
import { useShallow } from "zustand/react/shallow";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
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
  TONE_MARK_BY_ID,
  TONE_META,
  type SyllableAnalysis,
} from "@/entities/syllable";
import type { Word, WordMatches } from "@/entities/lexicon";
import { useBuilderStore, type PartKind } from "@/features/build-syllable";
import { AutoSpeakSwitch } from "@/features/customize-appearance";
import { MORPH_BY_VOWEL, MORPH_RULES } from "@abugikha/core/syllable";
import { fmt, useLocale, useLocalePath, useT } from "@/shared/i18n";
import { ROLE_TILE_COLOR, chipTile, cn, toneTileColor, vowelTileColor, type TileColor } from "@/shared/lib";
import { vowelGroup } from "@abugikha/core/vowel";
import { gsap, useGSAP, prefersReducedMotion } from "@/shared/lib/gsap";
import { speakThai } from "@/shared/lib/speech";
import { LetterNotebook, Phonetic, SpeakButton } from "@/shared/ui";

interface Props {
  analysis: SyllableAnalysis;
  initial: InitialUnit;
  vowel: Vowel;
  final: Consonant | null;
  words: WordMatches;
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
        "relative grid h-11 min-w-11 place-items-center border-2 px-1.5 font-thai text-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
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
      <SpeakButton text={word.thai} label="" className="px-2" />
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
        className="flex min-h-9 items-center gap-1.5 bg-paper/70 px-2.5 py-1 text-xs hover:bg-paper focus-visible:outline-2 focus-visible:outline-ink"
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
  const { setTab, pulse } = useBuilderStore(
    useShallow((s) => ({ setTab: s.setTab, pulse: s.pulse })),
  );
  const inner = useRef<HTMLDivElement>(null);
  const tone = TONE_META[a.tone];
  const toneTile = toneTileColor(a.tone);
  const clsColor = CLASS_META[a.cls].ink;
  const markChar = a.mark ? TONE_MARK_BY_ID.get(a.mark)!.char : null;
  const hasFinal = Boolean(final) && !a.finalDropped;
  // Bốn nhãn mảnh, cùng bộ màu với phần giới thiệu và Bảng chữ
  const partChips: { kind: PartKind; label: string; glyph: string; tile: TileColor; empty?: boolean }[] = [
    { kind: "initial", label: t.builder.parts.initial, glyph: initial.chars, tile: ROLE_TILE_COLOR.initial },
    { kind: "vowel", label: t.builder.parts.vowel, glyph: vowelGlyph(vowel, a.form), tile: vowelTileColor(vowelGroup(vowel)) },
    { kind: "final", label: t.builder.parts.final, glyph: hasFinal ? final!.char : "—", tile: ROLE_TILE_COLOR.final, empty: !hasFinal },
    { kind: "mark", label: t.builder.parts.mark, glyph: markChar ? `◌${markChar}` : "—", tile: toneTile, empty: !markChar },
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
      // Mảnh vừa chọn nảy lên, các mảnh khác chỉ nhấp nhẹ
      tl.fromTo(
        ".sum-chip",
        { scale: 0.85 },
        { scale: 1, duration: 0.6, ease: "back.out(2)", stagger: 0.04 },
        0,
      ).fromTo(
        ".sum-details",
        { opacity: 0.4 },
        { opacity: 1, duration: 0.3 },
        0,
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
      <DockSlot kind="vowel" label={t.builder.parts.vowel} glyph={vowelGlyph(vowel, a.form)} color="var(--color-part-vowel-ink)" onSelect={() => setTab("vowel")} />
      <Plus compact />
      <DockSlot
        kind="final"
        label={t.builder.parts.final}
        glyph={hasFinal ? final!.char : "—"}
        color="var(--color-part-final-ink)"
        empty={!hasFinal}
        onSelect={() => setTab("final")}
      />
      <Plus compact />
      <DockSlot
        kind="mark"
        label={t.builder.parts.mark}
        glyph={markChar ? `◌${markChar}` : "—"}
        color={tone.ink}
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
        className="pb-2 xl:pb-0"
      >
        {/* Cùng khung xem trước với trang Bảng chữ: vở 4 font, nhãn màu theo vai trò, loa không viền */}
        <div ref={inner} className="border-2 border-ink/30 bg-sheet p-4 md:p-5 xl:p-3">
          {/* Thông báo âm tiết vừa ghép và thanh của nó cho trình đọc màn hình */}
          <p role="status" className="sr-only">
            {`${a.spelling}, /${a.ipa}/, ${tone.label[locale]}`}
          </p>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-ink-soft">
            <span className="font-semibold uppercase tracking-wider">{t.notebook.title}</span>
            <AutoSpeakSwitch label={t.builder.autoSpeak} className="text-ink" />
          </div>
          <div role="img" aria-label={a.spelling}>
            <LetterNotebook text={a.spelling} hintClassName="xl:hidden" />
          </div>

          <div className="sum-details mt-5 space-y-3 border-t border-ink/10 pt-4 xl:mt-3 xl:space-y-2 xl:pt-3">
            <ul className="flex flex-wrap items-center gap-2" aria-label={t.builder.sumAria}>
              {partChips.map((c) => (
                <li key={c.kind}>
                  <button
                    type="button"
                    onClick={() => setTab(c.kind)}
                    aria-label={c.label}
                    title={c.label}
                    className={cn(chipTile({ tile: c.tile }).className, "sum-chip inline-flex items-center gap-1.5 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink", c.empty && "opacity-50")}
                    style={chipTile({ tile: c.tile }).style}
                  >
                    <span lang="th" className="font-thai text-lg leading-none">
                      {c.glyph}
                    </span>
                    <span>{c.label}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-3">
              <Phonetic ipa={a.ipa} className="text-xl" style={{ color: tone.ink }} />
              <span {...chipTile({ tile: toneTile })}>{tone.label[locale]}</span>
              <SpeakButton text={a.spelling} bare />
            </div>
            <p className="text-sm text-ink-soft">
              <span style={{ color: clsColor }}>{fmt(t.builder.formula.cls, { cls: CLASS_META[a.cls].label[locale] })}</span>
              {" + "}
              {a.liveness === "live" ? t.builder.formula.live : t.builder.formula.dead}
              {!a.mark && a.liveness === "dead" && a.cls === "low" && <> + {a.length === "long" ? t.builder.formula.long : t.builder.formula.short}</>}
              {" + "}
              {a.mark ? <span lang="th" className="font-thai">◌{markChar}</span> : t.builder.noMark}
            </p>
          </div>

          {a.warnings.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {a.warnings.map((w) => (
                <li key={w} className="flex gap-2 bg-paper px-3 py-2 text-sm text-high-ink">
                  <span aria-hidden className="font-bold">!</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          )}

          {notes.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {notes.map((n) => (
                <li key={n.id} className="flex flex-wrap items-baseline gap-x-2 bg-paper px-3 py-2 text-sm">
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
                  <p className="px-1 text-xs text-high-ink">
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
                <li className="mr-1 text-xs font-medium text-ink-soft">
                  {t.builder.inWords}
                </li>
                {words.compounds.map((w) => (
                  <CompoundChip key={w.thai} word={w} highlight={a.spelling} />
                ))}
              </ul>
            )}
          </div>

          {/* Các bước suy ra thanh luôn nằm sẵn trong mục mở được này (mở sẵn trên máy cảm ứng) */}
          <details className="group mt-3 border-2 border-ink px-3 py-2 xl:mt-2 xl:py-0" open={whyOpen} onToggle={(e) => setWhyOpen(e.currentTarget.open)}>
            <summary className="flex min-h-11 cursor-pointer list-none xl:min-h-9 items-center justify-between gap-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-ink">
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
            className="pointer-events-auto flex items-center gap-1.5 border-2 bg-paper px-2.5 py-2 shadow-[0_24px_60px_-18px_color-mix(in_oklab,var(--color-ink)_55%,transparent)] [animation:dock-in_.3s_cubic-bezier(.16,1,.3,1)] sm:gap-2.5 sm:px-4 sm:py-2.5"
            style={{
              borderColor: `color-mix(in oklab, ${clsColor} 55%, transparent)`,
            }}
          >
            {dockSlots}
            <Plus c="=" compact />
            <button
              type="button"
              onClick={() => speakThai(a.spelling)}
              className="flex items-center self-stretch border-2 bg-paper px-3 focus-visible:outline-2 focus-visible:outline-ink"
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
