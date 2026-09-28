"use client";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  TONE_MARK_BY_ID,
  MORPH_GROUPS,
  MORPH_RULES,
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
import { Phonetic, SpeakButton } from "@/shared/ui";

type Phase = "from" | "doomed" | "to";

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
    <span
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

function Form({
  label,
  spelling,
  tokens,
  ipa,
  toneColor,
  active,
}: {
  label: string;
  spelling: string;
  tokens: MorphToken[];
  ipa: string;
  toneColor: string;
  active: boolean;
}) {
  const { locale } = useLocale();
  const t = useT();
  const word = wordOf(spelling);
  return (
    <div className={cn("rounded-xl border px-3 py-2 transition-[opacity,border-color]", active ? "border-ink bg-paper" : "border-ink/10 opacity-60")}>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">{label}</p>
      <p className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-2xl" aria-label={spelling}>
          <ColoredWord tokens={tokens} toneColor={toneColor} />
        </span>
        <Phonetic ipa={ipa} className="text-sm" style={{ color: toneColor }} />
        <span className="text-sm text-ink-soft">{word ? word.meaning[locale] : t.morph.sample}</span>
      </p>
    </div>
  );
}

/**
 * "Nguyên âm biến hình": chọn một quy tắc, xem dạng mở đổi thành dạng có âm cuối.
 * Tự chạy lần lượt các quy tắc khi đang hiển thị; chọn tay (hoặc qua #morph-<id>) thì dừng tự chạy.
 */
export function VowelMorph({ focusVowel }: { focusVowel?: string }) {
  const t = useT();
  const { locale } = useLocale();
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState<Phase>("from");
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const ghosts = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const els = useRef(new Map<string, HTMLSpanElement>());
  const rects = useRef(new Map<string, DOMRect>());

  const examples = useMemo(() => MORPH_RULES.map((r) => buildMorph(r, locale)), [locale]);
  const m: MorphExample = examples[idx]!;
  const removedKeys = useMemo(() => new Set(m.fromTokens.filter((a) => !m.toTokens.some((b) => b.key === a.key)).map((a) => a.key)), [m]);
  const tokens = phase === "to" ? m.toTokens : m.fromTokens;
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

  const select = (i: number, user: boolean) => {
    if (user) setAuto(false);
    setIdx(i);
    setRun((n) => n + 1);
  };

  // Mở trang với #morph-<id> (vd. từ trang Ghép chữ) → chọn quy tắc đó và cuộn tới
  useEffect(() => {
    const fromHash = () => {
      const id = /^#morph-(.+)$/.exec(decodeURIComponent(location.hash))?.[1];
      const i = MORPH_RULES.findIndex((r) => r.id === id);
      if (i < 0) return;
      select(i, true);
      root.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  // Danh sách cuộn ngang (màn hình hẹp): kéo quy tắc đang chọn vào tầm nhìn, không cuộn cả trang
  useEffect(() => {
    const box = list.current;
    const btn = box?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!box || !btn || box.scrollWidth <= box.clientWidth) return;
    const left = btn.getBoundingClientRect().left - box.getBoundingClientRect().left + box.scrollLeft;
    box.scrollTo({ left: Math.max(0, left - 16), behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [idx]);

  // Chọn một nguyên âm ở bảng phía trên → nhảy tới quy tắc của nó (nếu có)
  useEffect(() => {
    if (!focusVowel) return;
    const i = MORPH_RULES.findIndex((r) => r.id === focusVowel);
    if (i >= 0) select(i, true);
  }, [focusVowel]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e!.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Dòng thời gian: dạng mở → đánh dấu mảnh bị bỏ → chuyển sang dạng mới → (tự chạy) quy tắc kế
  useEffect(() => {
    setPhase("from");
    if (!visible) return;
    const reduce = prefersReducedMotion();
    const timers = [
      setTimeout(() => setPhase("doomed"), reduce ? 300 : 900),
      setTimeout(
        () => {
          rects.current = new Map([...els.current].map(([k, el]) => [k, el.getBoundingClientRect()]));
          setPhase("to");
        },
        reduce ? 700 : 2100,
      ),
    ];
    if (auto) timers.push(setTimeout(() => setIdx((i) => (i + 1) % MORPH_RULES.length), 6000));
    return () => timers.forEach(clearTimeout);
  }, [idx, run, visible, auto]);

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

  return (
    <section ref={root} id="bien-hinh" aria-labelledby="morph-title" className="scroll-mt-20">
      <h2 id="morph-title" className="text-xl font-semibold">
        {t.morph.title}
      </h2>
      <p className="mb-4 mt-1 max-w-3xl text-sm text-ink-soft">{t.morph.intro}</p>

      <div className="grid gap-4 md:grid-cols-[15rem_minmax(0,1fr)]">
        <div ref={list} role="group" aria-label={t.morph.listAria} className="flex gap-3 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0">
          {MORPH_GROUPS.map((g) => (
            <div key={g} className="shrink-0 md:shrink">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-ink-soft">{t.morph.groups[g]}</p>
              <div className="flex gap-1.5 md:flex-col">
                {MORPH_RULES.map((r, i) =>
                  r.group !== g ? null : (
                    <button
                      key={r.id}
                      type="button"
                      aria-pressed={i === idx}
                      onClick={() => select(i, true)}
                      className={cn(
                        "grid min-w-44 grid-cols-[auto_1fr] items-center gap-x-3 rounded-xl border px-3 py-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:min-w-0",
                        i === idx ? "border-ink bg-paper shadow-[inset_0_0_0_1px_var(--color-ink)]" : "border-ink/10 bg-paper-deep hover:border-ink/30",
                      )}
                    >
                      <span className="row-span-2 whitespace-nowrap font-thai text-lg">
                        <PatternText text={patternLabel(r)} toneColor={TONE_META[examples[i]!.to.tone].color} />
                      </span>
                      <span className="text-[13px] font-semibold leading-tight">{examples[i]!.to.spelling}</span>
                      <span className="text-xs leading-tight text-ink-soft">{r.summary[locale]}</span>
                    </button>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-paper-deep p-4 md:sticky md:top-20 md:self-start md:p-5" aria-live="polite">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-thai text-2xl">
                <PatternText text={patternLabel(m.rule)} toneColor={TONE_META[m.to.tone].color} />
              </h3>
              <p className="mt-1 max-w-xl text-sm text-ink/80">{m.explanation}</p>
            </div>
            <div className="flex gap-2">
              <SpeakButton text={m.to.spelling} />
              <button
                type="button"
                onClick={() => select(idx, true)}
                className="rounded-full border border-ink/15 px-3 py-1 text-sm font-medium hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                ↻ {t.morph.replay}
              </button>
            </div>
          </div>

          <div
            ref={stage}
            lang="th"
            onClick={() => speakThai(shown.spelling)}
            className="relative mt-4 h-[clamp(150px,22vw,200px)] cursor-pointer overflow-hidden rounded-xl bg-paper text-[clamp(64px,11vw,116px)]"
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
                    phase === "doomed" && removedKeys.has(tok.key) ? "doomed" : phase === "to" && addedKeys.has(tok.key) ? "born" : "idle"
                  }
                  markState={
                    phase === "doomed" && markDiff.removed.has(tok.key) ? "doomed" : phase === "to" && markDiff.added.has(tok.key) ? "born" : "idle"
                  }
                />
              ))}
            </div>
            <div ref={ghosts} aria-hidden className="pointer-events-none absolute inset-0" />
          </div>

          <ul className="mt-3 flex min-h-8 flex-wrap gap-1.5 text-sm font-semibold">
            {m.removed.length === 0 && phase !== "from" && (
              <li className="rounded-lg bg-paper px-2.5 py-1 font-medium text-ink-soft">{t.morph.unchanged}</li>
            )}
            {m.removed.map((p, i) => (
              <li
                key={`r${i}`}
                className={cn("rounded-lg px-2.5 py-1 transition-opacity", phase === "from" ? "opacity-0" : "opacity-100")}
                style={{ color: "var(--color-removed)", backgroundColor: soft("var(--color-removed)") }}
              >
                − <span className="font-thai text-lg font-normal line-through decoration-2">{withHolder(p)}</span>
              </li>
            ))}
            {m.added.map((p, i) => (
              <li
                key={`a${i}`}
                className={cn("rounded-lg px-2.5 py-1 transition-opacity delay-300", phase === "to" ? "opacity-100" : "opacity-0")}
                style={{ color: roleColor(p.role, TONE_META[m.to.tone].color), backgroundColor: soft(roleColor(p.role, TONE_META[m.to.tone].color)) }}
              >
                + <span className="font-thai text-lg font-normal">{withHolder(p)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-3 grid items-center gap-2 sm:grid-cols-[1fr_auto_1fr]">
            <Form label={t.morph.from} spelling={m.from.spelling} tokens={m.fromTokens} ipa={m.from.ipa} toneColor={TONE_META[m.from.tone].color} active={phase !== "to"} />
            <span aria-hidden className="justify-self-center text-xl text-ink-soft max-sm:rotate-90">
              →
            </span>
            <Form
              label={m.rule.mark ? t.morph.toMark : t.morph.to}
              spelling={m.to.spelling}
              tokens={m.toTokens}
              ipa={m.to.ipa}
              toneColor={TONE_META[m.to.tone].color}
              active={phase === "to"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
