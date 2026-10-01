"use client";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  TONE_MARK_BY_ID,
  buildMorph,
  type MorphExample,
  type MorphRule,
  type MorphPiece,
  type MorphToken,
  type SegmentRole,
} from "@abugikha/core/syllable";
import { VOWEL_BY_ID, closedPattern, vowelGlyph } from "@abugikha/core/vowel";
import { CONSONANT_BY_ID } from "@abugikha/core/consonant";
import { WORDS } from "@abugikha/core/lexicon";
import { TONE_META } from "../model/tone";
import { useLocale, useT } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { gsap, prefersReducedMotion } from "@/shared/lib/gsap";
import { speakThai } from "@/shared/lib/speech";
import { Phonetic } from "@/shared/ui";

/** from → (final: phụ âm cuối xuất hiện) → doomed: đánh dấu mảnh bị bỏ → to: dạng mới */
type Phase = "from" | "final" | "doomed" | "to";

const holder = (p: string) => p.replace("C", "◌").replace("F", "◌");

/** Màu theo vai trò của mảnh; dấu thanh lấy màu của thanh */
const roleColor = (role: SegmentRole, toneColor: string) =>
  role === "vowel" ? "var(--color-part-vowel)" : role === "final" ? "var(--color-part-final)" : role === "mark" ? toneColor : "var(--color-ink)";
const soft = (color: string, pct = 14) => `color-mix(in oklab, ${color} ${pct}%, transparent)`;

const COMBINING_RE = /[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/u;
const BELOW_RE = /[\u0E38-\u0E3A]/u;
const withHolder = (p: MorphPiece) => (COMBINING_RE.test(p.text) ? `◌${p.text}` : p.text);
const minusMarks = (a: MorphPiece[], b: MorphPiece[]) => a.filter((x) => !b.some((y) => y.text === x.text));

type PieceState = "idle" | "doomed" | "born";

/**
 * Một mảnh chữ. Nếu có dấu trên/dưới thì vẽ hai lớp: lớp dưới là cả cụm (màu của dấu),
 * lớp trên chỉ chữ chính (màu của chữ) che đúng phần chữ. Nhờ vậy dấu vẫn gắn đúng chỗ
 * mà vẫn tô được màu riêng, trên mọi trình duyệt.
 */
function Piece({
  tok,
  toneColor,
  state = "idle",
  markState = "idle",
  pieceRef,
  className,
}: {
  tok: MorphToken;
  toneColor: string;
  state?: PieceState;
  markState?: PieceState;
  pieceRef?: (el: HTMLSpanElement | null) => void;
  className?: string;
}) {
  const base = roleColor(tok.role, toneColor);
  const mark = tok.marks[0];
  const markColor = mark ? (markState === "doomed" ? "var(--color-removed)" : roleColor(mark.role, toneColor)) : base;
  return (
    <span lang="th"
      ref={pieceRef}
      className={cn(
        "relative block whitespace-pre font-thai",
        state === "doomed" && "morph-doomed",
        state === "born" && "morph-born",
        className,
      )}
      style={{ color: mark ? markColor : base }}
    >
      <span className={cn(mark && markState === "born" && "morph-born")}>{tok.text}</span>
      {mark && (
        <span aria-hidden className="absolute left-0 top-0" style={{ color: state === "doomed" ? "var(--color-removed)" : base }}>
          {tok.base}
        </span>
      )}
      {mark && markState === "doomed" && (
        // Vạch gạch ngang ngay tầng của dấu bị loại (trên ~22% chiều cao dòng, dưới ~77%)
        <span
          aria-hidden
          className="morph-doomed-mark absolute left-[15%] right-[15%] h-[0.06em] rounded bg-[var(--color-removed)]"
          style={{ top: BELOW_RE.test(mark.text) ? "77%" : "22%" } as CSSProperties}
        />
      )}
    </span>
  );
}

/** Chữ hoàn chỉnh tô màu theo từng mảnh (dùng cho ô dạng mở / dạng đóng) */
function ColoredWord({ tokens, toneColor }: { tokens: MorphToken[]; toneColor: string }) {
  return (
    <span className="inline-flex gap-[0.02em] leading-[1.6]">
      {tokens.map((tok) => (
        <Piece key={tok.key} tok={tok} toneColor={toneColor} />
      ))}
    </span>
  );
}

/** Nhãn quy tắc: nguyên âm màu nguyên âm, chữ cái (âm cuối) màu âm cuối, dấu thanh màu thanh */
function PatternText({ text, toneColor }: { text: string; toneColor?: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span
          key={i}
          style={{
            color:
              w === "→" || w === "+"
                ? "var(--color-ink-soft)"
                : /^[ก-ฮ]$/u.test(w)
                  ? "var(--color-part-final)"
                  : /^◌[่-๋]$/u.test(w)
                    ? (toneColor ?? "var(--color-ink)")
                    : "var(--color-part-vowel)",
          }}
        >
          {i > 0 && " "}
          {w}
        </span>
      ))}
    </>
  );
}

/** Nhãn quy tắc, vd. "◌ะ → ◌ั◌", "เ◌อ + ย → เ◌ย" hoặc "เ◌็◌ + ◌่ → เ◌่◌" */
function patternLabel(rule: MorphRule): string {
  const v = VOWEL_BY_ID.get(rule.vowelId)!;
  const final = CONSONANT_BY_ID.get(rule.final)!.char;
  const closed = holder(closedPattern(v, final) ?? v.open);
  if (rule.mark) {
    const mark = TONE_MARK_BY_ID.get(rule.mark)!.char;
    return `${closed} + ◌${mark} → ${closed.replace("็", mark)}`;
  }
  if (closed !== holder(v.closed ?? "")) return `${vowelGlyph(v)} + ${final} → ${closed.replace(/◌$/, final)}`;
  return `${vowelGlyph(v)} → ${closed}`;
}

const wordOf = (thai: string) => WORDS.find((w) => w.thai === thai);

/** Một dạng chữ gọn trên một dòng: chữ tô màu theo vai trò, IPA, nghĩa (nếu là từ có trong từ điển) */
function FormInline({ label, spelling, tokens, ipa, toneColor, active }: { label: string; spelling: string; tokens: MorphToken[]; ipa: string; toneColor: string; active: boolean }) {
  const { locale } = useLocale();
  const t = useT();
  const word = wordOf(spelling);
  return (
    <span title={label} className={cn("inline-flex flex-wrap items-baseline gap-x-1.5 transition-opacity", !active && "opacity-50")}>
      <span className="text-xl" aria-label={`${label}: ${spelling}`}>
        <ColoredWord tokens={tokens} toneColor={toneColor} />
      </span>
      <Phonetic ipa={ipa} className="text-xs" style={{ color: toneColor }} />
      <span className="text-xs text-ink-soft">{word ? word.meaning[locale] : t.morph.sample}</span>
    </span>
  );
}

/**
 * Minh hoạ nguyên âm biến hình cho một chữ: dạng mở → mảnh bị bỏ → dạng mới.
 * `rules` là các quy tắc của chữ đang chọn (vd. เ-อ có hai: thêm ◌ิ, hoặc gặp ย thì อ biến mất).
 */
export function MorphPanel({ rules, initialId }: { rules: MorphRule[]; initialId?: string }) {
  const t = useT();
  const { locale } = useLocale();
  const [idx, setIdx] = useState(() => Math.max(0, rules.findIndex((r) => r.id === initialId)));
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState<Phase>("from");
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const ghosts = useRef<HTMLDivElement>(null);
  const els = useRef(new Map<string, HTMLSpanElement>());
  const rects = useRef(new Map<string, DOMRect>());

  const examples = useMemo(() => rules.map((r) => buildMorph(r, locale)), [rules, locale]);
  const m: MorphExample = examples[idx]!;
  const removedKeys = useMemo(() => new Set(m.fromTokens.filter((a) => !m.toTokens.some((b) => b.key === a.key)).map((a) => a.key)), [m]);
  // Phụ âm cuối mới (quy tắc dấu thanh thì dạng mở đã có âm cuối nên không có)
  const finalTok = useMemo(() => m.toTokens.find((b) => b.role === "final" && !m.fromTokens.some((a) => a.key === b.key)), [m]);
  const tokens =
    phase === "to" ? m.toTokens : finalTok && (phase === "final" || phase === "doomed") ? [...m.fromTokens, finalTok] : m.fromTokens;
  // Dấu bị bỏ / được thêm bên trong một mảnh giữ lại (vd. ว → วั, สั → ส, ล็ → ล่)
  const markDiff = useMemo(() => {
    const removed = new Set<string>();
    const added = new Set<string>();
    for (const a of m.fromTokens) {
      const b = m.toTokens.find((x) => x.key === a.key);
      if (!b) continue;
      if (minusMarks(a.marks, b.marks).length) removed.add(a.key);
      if (minusMarks(b.marks, a.marks).length) added.add(a.key);
    }
    return { removed, added };
  }, [m]);
  const addedKeys = useMemo(() => new Set(m.toTokens.filter((b) => !m.fromTokens.some((a) => a.key === b.key)).map((b) => b.key)), [m]);

  const select = (i: number) => {
    setIdx(i);
    setRun((n) => n + 1);
  };

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e!.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Dòng thời gian: dạng mở → đánh dấu mảnh bị bỏ → chuyển sang dạng mới
  useEffect(() => {
    setPhase("from");
    if (!visible) return;
    const reduce = prefersReducedMotion();
    // Có âm cuối mới: cho nó xuất hiện trước, rồi mới đánh dấu và đổi nguyên âm
    const at = finalTok ? (reduce ? [200, 500, 900] : [700, 1700, 2900]) : reduce ? [0, 300, 700] : [0, 900, 2100];
    const timers = [
      ...(finalTok ? [setTimeout(() => setPhase("final"), at[0])] : []),
      setTimeout(() => setPhase("doomed"), at[1]),
      setTimeout(
        () => {
          rects.current = new Map([...els.current].map(([k, el]) => [k, el.getBoundingClientRect()]));
          setPhase("to");
        },
        at[2],
      ),
    ];
    return () => timers.forEach(clearTimeout);
  }, [idx, run, visible, finalTok]);

  // Chuyển cảnh kiểu FLIP: mảnh giữ lại trượt về chỗ mới, mảnh bị bỏ rơi xuống, mảnh mới bay vào
  useLayoutEffect(() => {
    if (phase !== "to" || prefersReducedMotion() || !stage.current || !ghosts.current) return;
    const box = stage.current.getBoundingClientRect();
    const layer = ghosts.current;
    const tl = gsap.timeline();
    for (const tok of m.fromTokens) {
      if (!removedKeys.has(tok.key)) continue;
      const r = rects.current.get(tok.key);
      if (!r) continue;
      const g = document.createElement("span");
      g.textContent = tok.text;
      g.className = "morph-ghost absolute font-thai leading-[1.6]";
      Object.assign(g.style, { left: `${r.left - box.left}px`, top: `${r.top - box.top}px` });
      layer.append(g);
      tl.fromTo(
        g,
        { scale: 1.18 },
        { y: "0.45em", rotate: -14, scale: 0.55, opacity: 0, duration: 0.7, ease: "power2.in", onComplete: () => g.remove() },
        0,
      );
    }
    const before = new Map(m.fromTokens.map((x) => [x.key, x.text]));
    for (const tok of m.toTokens) {
      const el = els.current.get(tok.key);
      if (!el) continue;
      const old = rects.current.get(tok.key);
      if (old) {
        tl.from(el, { x: old.left - el.getBoundingClientRect().left, duration: 0.7, ease: "power3.out" }, 0);
        if (before.get(tok.key) !== tok.text) tl.from(el, { opacity: 0.15, filter: "blur(4px)", duration: 0.5 }, 0.2);
      } else {
        tl.from(el, { opacity: 0, x: "0.7em", scale: 0.8, duration: 0.65, ease: "back.out(1.6)" }, 0.3);
      }
    }
    return () => {
      // revert (không phải kill): gỡ hết style dở dang vì các <span> được dùng lại giữa các lần chạy
      tl.revert();
      layer.replaceChildren();
    };
  }, [phase, m, removedKeys]);

  const shown = phase === "to" ? m.to : m.from;
  const shownTone = TONE_META[shown.tone].color;

  const iconBtn =
    "grid size-11 shrink-0 place-items-center rounded-full border border-ink/15 hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
  const chip = "rounded-md px-1.5 py-0.5 text-xs font-semibold transition-opacity";

  return (
    <section ref={root} aria-labelledby="morph-title">
      <div className="flex items-center gap-2">
        <h3 id="morph-title" className="min-w-0 flex-1 text-sm font-semibold">
          {t.morph.title}{" "}
          <span lang="th" className="whitespace-nowrap font-thai text-lg font-normal">
            <PatternText text={patternLabel(m.rule)} toneColor={TONE_META[m.to.tone].color} />
          </span>
        </h3>
        <button type="button" onClick={() => speakThai(m.to.spelling)} aria-label={t.common.listen} title={t.common.listen} className={iconBtn}>
          <svg aria-hidden viewBox="0 0 20 20" className="size-4 fill-current">
            <path d="M3 8v4h3l4 4V4L6 8H3zm10.5 2a3.5 3.5 0 0 0-2-3.2v6.4a3.5 3.5 0 0 0 2-3.2zM11.5 3v1.6a5.5 5.5 0 0 1 0 10.8V17a7 7 0 0 0 0-14z" />
          </svg>
        </button>
        <button type="button" onClick={() => select(idx)} aria-label={t.morph.replay} title={t.morph.replay} className={iconBtn}>
          <svg aria-hidden viewBox="0 0 20 20" className="size-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 10a6 6 0 1 1-1.8-4.3M16 3.5v3.2h-3.2" />
          </svg>
        </button>
      </div>
      {rules.length > 1 && (
        <div role="group" aria-label={t.morph.listAria} className="mt-2 flex flex-wrap gap-1.5">
          {rules.map((r, i) => (
            <button
              key={r.id}
              type="button"
              aria-pressed={i === idx}
              onClick={() => select(i)}
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                i === idx ? "border-ink bg-ink text-paper" : "border-ink/15 hover:border-ink/40",
              )}
            >
              {r.summary[locale]}
            </button>
          ))}
        </div>
      )}
      <p className="mt-1.5 text-xs leading-relaxed text-ink/80">{m.explanation}</p>

      <div aria-live="polite">
      <div
        ref={stage}
        lang="th"
        onClick={() => speakThai(shown.spelling)}
        className="relative mt-2 h-28 cursor-pointer overflow-hidden rounded-xl border border-ink/10 bg-paper text-[3.75rem]"
      >
        <div aria-hidden className="absolute inset-x-0 top-[30%] h-[44%] border-y-[1.5px] border-ink/20 bg-paper-deep/60" />
        <div className="absolute inset-0 flex items-center justify-center gap-[0.03em]">
          {tokens.map((tok) => (
            <Piece
              key={tok.key}
              tok={tok}
              toneColor={shownTone}
              className="leading-[1.6]"
              pieceRef={(el) => {
                if (el) els.current.set(tok.key, el);
                else els.current.delete(tok.key);
              }}
              state={
                phase === "doomed" && removedKeys.has(tok.key)
                  ? "doomed"
                  : tok.key === finalTok?.key
                    ? phase === "final" ? "born" : "idle"
                    : phase === "to" && addedKeys.has(tok.key) ? "born" : "idle"
              }
              markState={
                phase === "doomed" && markDiff.removed.has(tok.key) ? "doomed" : phase === "to" && markDiff.added.has(tok.key) ? "born" : "idle"
              }
            />
          ))}
        </div>
        <div ref={ghosts} aria-hidden className="pointer-events-none absolute inset-0" />
      </div>
        {/* Dạng mở → dạng mới trên một dòng, kèm mảnh bị bỏ / được thêm */}
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <FormInline label={t.morph.from} spelling={m.from.spelling} tokens={m.fromTokens} ipa={m.from.ipa} toneColor={TONE_META[m.from.tone].color} active={phase !== "to"} />
          <span aria-hidden className="text-ink-soft">→</span>
          <FormInline
            label={m.rule.mark ? t.morph.toMark : t.morph.to}
            spelling={m.to.spelling}
            tokens={m.toTokens}
            ipa={m.to.ipa}
            toneColor={TONE_META[m.to.tone].color}
            active={phase === "to"}
          />
          <span className="ml-auto flex flex-wrap gap-1">
            {m.removed.length === 0 && (phase === "doomed" || phase === "to") && (
              <span className="rounded-md bg-paper px-1.5 py-0.5 text-xs text-ink-soft">{t.morph.unchanged}</span>
            )}
            {m.removed.map((p, i) => (
              <span
                key={`r${i}`}
                className={cn(chip, phase === "doomed" || phase === "to" ? "opacity-100" : "opacity-0")}
                style={{ color: "var(--color-removed)", backgroundColor: soft("var(--color-removed)") }}
              >
                − <span lang="th" className="font-thai text-base font-normal line-through decoration-2">{withHolder(p)}</span>
              </span>
            ))}
            {m.added.map((p, i) => (
              <span
                key={`a${i}`}
                className={cn(chip, "delay-300", phase === "to" || (p.role === "final" && phase !== "from") ? "opacity-100" : "opacity-0")}
                style={{ color: roleColor(p.role, TONE_META[m.to.tone].color), backgroundColor: soft(roleColor(p.role, TONE_META[m.to.tone].color)) }}
              >
                + <span lang="th" className="font-thai text-base font-normal">{withHolder(p)}</span>
              </span>
            ))}
          </span>
        </div>
      </div>
    </section>
  );
}
