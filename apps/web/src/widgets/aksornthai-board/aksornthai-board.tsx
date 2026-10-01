"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CLASS_META,
  CONSONANT_BY_ID,
  CONSONANTS,
  INITIAL_BY_ID,
  consonantSpeech,
  type Consonant,
  type ConsonantClass,
} from "@/entities/consonant";
import { DIGITS, type ThaiDigit } from "@/entities/writing";
import {
  VOWELS,
  vowelFitsInitial,
  vowelGlyph,
  type Vowel,
} from "@/entities/vowel";
import { MorphPanel, TONE_MARKS, TONE_MARK_BY_ID, TONE_META, resolveTone, type ToneMark } from "@/entities/syllable";
import { MORPH_RULES } from "@abugikha/core/syllable";
import { VOWEL_GROUPS, vowelGroup, type VowelGroup } from "@abugikha/core/vowel";
import { useBuilderStore } from "@/features/build-syllable";
import { fmt, useLocale, useLocalePath, useT } from "@/shared/i18n";
import { cn, tint } from "@/shared/lib";
import { prefersReducedMotion } from "@/shared/lib/gsap";
import { speakThai } from "@/shared/lib/speech";
import { LIGHT_VARS, Phonetic, SpeakButton } from "@/shared/ui";
import { LetterNotebook } from "./letter-notebook";

type Selected =
  | { kind: "consonant"; item: Consonant }
  | { kind: "vowel"; item: Vowel }
  | { kind: "digit"; item: ThaiDigit }
  | { kind: "tone"; item: ToneMark };

/** Phụ âm đại diện mỗi nhóm để minh hoạ dấu thanh: ก่า ข่า ค่า */
const CLASS_EXAMPLE: Record<ConsonantClass, string> = { mid: "ก", high: "ข", low: "ค" };
const CLASSES: ConsonantClass[] = ["mid", "high", "low"];

/** Nguyên âm đổi cách viết khi có âm cuối, và quy tắc dấu thanh đẩy ◌็ ra (áp dụng cho mọi dấu thanh) */
const VOWEL_MORPHS = MORPH_RULES.filter((r) => !r.mark);
const MARK_MORPHS = MORPH_RULES.filter((r) => r.mark);
const MORPH_VOWEL_IDS = new Set(VOWEL_MORPHS.map((r) => r.vowelId));
const morphRulesOf = (s: Selected) =>
  s.kind === "vowel" ? VOWEL_MORPHS.filter((r) => r.vowelId === s.item.id) : s.kind === "tone" ? MARK_MORPHS : [];
/** Mọi ô cùng một cỡ 4.5rem; ô nguyên âm cùng chiều cao nhưng dài theo số chữ */
const TILE = "size-18";
const WIDE_TILE = "h-18 min-w-18 px-3";
/** Ô đang chọn của phụ âm: quầng sáng theo màu nhóm thay vì viền trắng */
const CLASS_RING: Record<ConsonantClass, string> = { mid: "ring-mid", high: "ring-high", low: "ring-low" };
/**
 * Ô nguyên âm / dấu thanh. `cn` chỉ nối chuỗi nên mỗi trạng thái chỉ có đúng một màu viền:
 * đang chọn = đảo màu (như nút lọc), biến hình = viền tím, ngắn = nét đứt.
 */
const glyphTile = ({ active, morph, short }: { active: boolean; morph: boolean; short?: boolean }) =>
  cn(
    "flex shrink-0 items-center justify-center text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
    short ? "border-dashed" : "border-solid",
    morph ? "border-[1.5px]" : "border",
    active
      ? "border-ink bg-ink text-paper"
      : cn("bg-paper-deep hover:bg-paper", morph ? "border-part-vowel/70" : short ? "border-ink/30" : "border-ink/10"),
  );
/** Các dạng khi có âm cuối, kể cả dạng riêng theo âm cuối (vd. เ◌อ: เ◌ิ◌, gặp ย thành เ◌ย) */
const closedForms = (v: Vowel) => [
  vowelGlyph(v, "closed"),
  ...Object.entries(v.closedBy ?? {}).map(([f, pattern]) => `+ ${f} → ${pattern.replace("C", "◌").replace("F", f)}`),
];

const pill = (on: boolean) =>
  cn(
    "px-3 py-1 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
    on ? "bg-ink text-paper" : "bg-paper-deep hover:bg-ink/10",
  );

export function AksornThaiBoard() {
  const t = useT();
  const { locale } = useLocale();
  const router = useRouter();
  const href = useLocalePath();
  const setPart = useBuilderStore((s) => s.setPart);
  const [sel, setSel] = useState<Selected>({ kind: "consonant", item: CONSONANTS[0] });
  const [cls, setCls] = useState<"all" | ConsonantClass>("all");
  const [vGroup, setVGroup] = useState<"all" | VowelGroup>("all");
  const preview = useRef<HTMLElement>(null);
  // Quy tắc biến hình mở sẵn (vd. từ link #morph-ooe-y ở trang Ghép chữ)
  const [morphId, setMorphId] = useState<string>();
  const morphRules = useMemo(() => morphRulesOf(sel), [sel]);
  // Desktop: khung preview cao tối đa bằng màn hình và cuộn bên trong (ẩn thanh cuộn); dải mờ ở đáy báo còn nội dung
  const [more, setMore] = useState(false);
  useEffect(() => {
    const el = preview.current;
    if (!el) return;
    const update = () => setMore(el.scrollHeight - el.scrollTop - el.clientHeight > 4);
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [sel, morphRules]);

  useEffect(() => {
    const fromHash = () => {
      const id = /^#morph-(.+)$/.exec(decodeURIComponent(location.hash))?.[1];
      const rule = MORPH_RULES.find((r) => r.id === id);
      if (!rule) return;
      setMorphId(rule.id);
      setSel(rule.mark ? { kind: "tone", item: TONE_MARK_BY_ID.get(rule.mark)! } : { kind: "vowel", item: VOWELS.find((v) => v.id === rule.vowelId)! });
      preview.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const char =
    sel.kind === "vowel" ? vowelGlyph(sel.item) : sel.kind === "tone" ? `◌${sel.item.char}` : sel.item.char;
  const color =
    sel.kind === "consonant"
      ? CLASS_META[sel.item.cls].color
      : "var(--color-ink)";

  const choose = (s: Selected) => {
    setSel(s);
    setMorphId(undefined);
    // Về đầu khung preview để luôn thấy chữ vừa chọn ở 4 font
    preview.current?.scrollTo({ top: 0 });
    // Mobile: khung preview nằm trên cùng; phần đầu (4 font) đã cuộn khuất thì kéo về để thấy chữ vừa chọn
    const box = preview.current?.getBoundingClientRect();
    if (box && box.top < 0) preview.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    if (s.kind === "vowel" || s.kind === "tone") return;
    speakThai(s.kind === "consonant" ? consonantSpeech(s.item) : s.item.word);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] xl:grid-cols-[minmax(0,1fr)_28rem]">
      {/* Khung preview dùng chung: trên cùng ở mobile, cột phải dính khi cuộn ở desktop */}
      <aside
        ref={preview}
        style={LIGHT_VARS} className="order-first scroll-mt-20 bg-poster-cream p-4 text-poster-black md:p-5 lg:sticky lg:top-20 lg:order-last lg:max-h-[calc(100dvh-6rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden"
      >
        {/* Chỉ thông báo một dòng ngắn khi đổi lựa chọn, không đọc lại cả khung */}
        <p role="status" className="sr-only">
          {sel.kind === "consonant" ? `${consonantSpeech(sel.item)}, ${CLASS_META[sel.item.cls].label[locale]}` : char}
        </p>
        {/* Chữ đặt trong vở 4 tầng để thấy nó nằm ở dòng nào khi viết */}
        <div role="img" aria-label={char}>
          <LetterNotebook text={char} />
        </div>

        <div className="mt-5 space-y-3 border-t border-ink/10 pt-4">
          {sel.kind === "consonant" ? (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <span lang="th" className="font-thai text-3xl">
                  {consonantSpeech(sel.item)}
                </span>
                <span
                  className="px-2.5 py-0.5 text-xs font-medium text-on-accent"
                  style={{ backgroundColor: color }}
                >
                  {fmt(t.builder.formula.cls, { cls: CLASS_META[sel.item.cls].label[locale] })}
                </span>
                {sel.item.obsolete && (
                  <span className="border border-ink/20 px-2 py-0.5 text-xs text-ink-soft">
                    {t.aksornthai.obsolete}
                  </span>
                )}
              </div>
              <p className="text-sm text-ink-soft">
                {sel.item.name} · {t.aksornthai.keyword}:{" "}
                <span lang="th" className="font-thai text-base text-ink">
                  {sel.item.word}
                </span>{" "}
                “{sel.item.meaning[locale]}”
              </p>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-paper px-3 py-2">
                  <dt className="text-xs text-ink-soft">
                    {t.aksornthai.initial}
                  </dt>
                  <dd>
                    <Phonetic ipa={sel.item.initial} />
                  </dd>
                </div>
                <div className="bg-paper px-3 py-2">
                  <dt className="text-xs text-ink-soft">{t.aksornthai.final}</dt>
                  <dd>
                    {sel.item.final ? (
                      <Phonetic ipa={sel.item.final} />
                    ) : (
                      <span className="text-ink-soft">
                        {t.aksornthai.noFinal}
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
              <div className="flex flex-wrap gap-2">
                <SpeakButton
                  text={consonantSpeech(sel.item)}
                  label={t.aksornthai.listenName}
                />
                {INITIAL_BY_ID.has(sel.item.char) && (
                  <button
                    type="button"
                    onClick={() => {
                      setPart("initial", sel.item.char);
                      router.push(href("/lab"));
                    }}
                    className="btn btn-outline btn-xs"
                  >
                    {t.aksornthai.tryIt} →
                  </button>
                )}
              </div>
            </>
          ) : sel.kind === "vowel" ? (
            <>
              <div className="flex flex-wrap items-baseline gap-3">
                <span lang="th" className="font-thai text-2xl">
                  {vowelGlyph(sel.item)}
                </span>
                <Phonetic ipa={sel.item.ipa} className="text-ink-soft" />
              </div>
              <p className="text-sm text-ink-soft">
                {sel.item.approx[locale]} ·{" "}
                {sel.item.length === "long" ? t.ipa.long : t.ipa.short}
              </p>
              {sel.item.closed && (
                <p className="text-sm">
                  {t.aksornthai.closedForm}:{" "}
                  <span lang="th" className="font-thai text-xl">
                    {closedForms(sel.item).join(" · ")}
                  </span>
                </p>
              )}
              <button
                type="button"
                onClick={() => {
                  const state = useBuilderStore.getState();
                  const currentInitial = INITIAL_BY_ID.get(state.initialId)!;
                  const currentFinal = state.finalId
                    ? CONSONANT_BY_ID.get(state.finalId)
                    : null;
                  if (!vowelFitsInitial(sel.item, currentInitial.chars))
                    setPart("initial", "ก");
                  if (
                    currentFinal &&
                    (!sel.item.closed ||
                      sel.item.excludeFinals?.includes(currentFinal.char))
                  ) {
                    setPart("final", null);
                  }
                  setPart("vowel", sel.item.id);
                  router.push(href("/lab"));
                }}
                className="w-fit btn btn-outline btn-xs"
              >
                {t.aksornthai.tryVowel} →
              </button>
            </>
          ) : sel.kind === "digit" ? (
            <>
              <div className="flex items-baseline gap-3">
                <span lang="th" className="font-thai text-3xl">{sel.item.word}</span>
                <Phonetic ipa={sel.item.ipa} className="text-ink-soft" />
              </div>
              <p className="text-sm">
                {t.aksornthai.value}:{" "}
                <span className="font-semibold">{sel.item.value}</span>
              </p>
              <SpeakButton text={sel.item.word} />
            </>
          ) : (
            <ToneDetails
              mark={sel.item}
              onTry={() => {
                setPart("mark", sel.item.id);
                router.push(href("/lab"));
              }}
            />
          )}
        </div>

        {morphRules.length > 0 && (
          <div className="mt-5 border-t border-ink/10 pt-4">
            <MorphPanel key={`${sel.kind}-${morphRules[0]!.vowelId}-${morphId ?? ""}`} rules={morphRules} initialId={morphId} />
          </div>
        )}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none sticky -bottom-4 -mx-4 -mb-4 hidden h-12 bg-linear-to-t from-poster-cream to-transparent md:-bottom-5 md:-mx-5 md:-mb-5",
            more && "lg:block",
          )}
        />
      </aside>

      {/* Cột chọn chữ; các phần ngăn bởi đường nét đứt */}
      <div className="divide-y-4 divide-ink [&>*]:py-8 [&>*:first-child]:pt-0 [&>*:last-child]:pb-0">
        <section aria-labelledby="cons-title">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h2 id="cons-title" className="mr-2 font-poster text-4xl font-extrabold uppercase leading-none">
              {t.aksornthai.consonants}
            </h2>
            {(["all", "mid", "high", "low"] as const).map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={cls === c}
                onClick={() => setCls(c)}
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
            <span className="ml-auto text-xs text-ink-soft">
              {t.aksornthai.rareHint}
            </span>
          </div>
          <ul className="flex flex-wrap gap-2">
            {CONSONANTS.map((c) => {
              const active =
                sel.kind === "consonant" && sel.item.char === c.char;
              const hidden = cls !== "all" && c.cls !== cls;
              return (
                <li key={c.char} className={cn(hidden && "hidden")}>
                  <button
                    type="button"
                    onClick={() => choose({ kind: "consonant", item: c })}
                    aria-pressed={active}
                    aria-label={`${c.char}, ${c.name}, ${CLASS_META[c.cls].label[locale]}`}
                    className={cn(
                      "relative flex size-18 flex-col items-center justify-center transition-[scale] hover:scale-105 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink",
                      (c.common || active) &&
                        `${CLASS_META[c.cls].bg} text-on-accent`,
                      active &&
                        `ring-2 ring-offset-2 ring-offset-paper ${CLASS_RING[c.cls]}`,
                    )}
                    // Chữ ít gặp: nền và viền nhạt đi, chữ vẫn rõ
                    style={
                      !c.common && !active
                        ? {
                            backgroundColor: tint(CLASS_META[c.cls].color, 14),
                            color: CLASS_META[c.cls].color,
                            boxShadow: `inset 0 0 0 1.5px ${tint(CLASS_META[c.cls].color, 35)}`,
                          }
                        : undefined
                    }
                  >
                    <span lang="th"
                      className={cn(
                        "font-thai text-4xl leading-none",
                        c.obsolete && "line-through decoration-2",
                      )}
                    >
                      {c.char}
                    </span>

                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="vowel-title">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h2 id="vowel-title" className="mr-2 font-poster text-4xl font-extrabold uppercase leading-none">
              {t.aksornthai.vowels}
            </h2>
            {(["all", ...VOWEL_GROUPS] as const).map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={vGroup === g}
                onClick={() => setVGroup(g)}
                className={pill(vGroup === g)}
              >
                {g === "all" ? t.builder.filters.all : t.groups.vowels[g]}
                </button>
                ))}
                <span className="ml-auto text-xs text-ink-soft">
                  {t.aksornthai.morphHint}
                </span>
          </div>
          <div className="space-y-5">
            {VOWEL_GROUPS.filter((g) => vGroup === "all" || vGroup === g).map((g) => (
              <div key={g}>
                <h3 className="mb-2 flex flex-wrap items-baseline gap-x-2 text-sm font-semibold">
                  {t.groups.vowels[g]}
                  <span className="text-xs font-normal text-ink-soft">{t.groups.vowelHints[g]}</span>
                </h3>
                {g === "diph" && <p className="mb-2 max-w-2xl text-sm text-ink/80">{t.groups.diphIntro}</p>}
                <ul className="flex flex-wrap gap-2">
                  {VOWELS.filter((v) => vowelGroup(v) === g).map((vowel) => {
                    const active = sel.kind === "vowel" && sel.item.id === vowel.id;
                    return (
                      <li key={vowel.id}>
                        <button
                          type="button"
                          onClick={() => choose({ kind: "vowel", item: vowel })}
                          aria-pressed={active}
                          aria-label={`${vowelGlyph(vowel)}, /${vowel.ipa}/, ${vowel.length === "long" ? t.ipa.long : t.ipa.short}`}
                          // Viền nét đứt = nguyên âm ngắn (cùng quy ước với trang IPA và Ghép chữ)
                          className={cn(WIDE_TILE, glyphTile({ active, morph: MORPH_VOWEL_IDS.has(vowel.id), short: vowel.length === "short" }))}
                        >
                          <span lang="th" className="block whitespace-nowrap font-thai text-2xl leading-tight">
                            {vowelGlyph(vowel)}
                          </span>

                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>


        <section aria-labelledby="digit-title">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h2 id="digit-title" className="mr-2 font-poster text-4xl font-extrabold uppercase leading-none">
              {t.aksornthai.digits}
            </h2>
          </div>
          <ul className="flex flex-wrap gap-2">
            {DIGITS.map((d) => {
              const active = sel.kind === "digit" && sel.item.char === d.char;
              return (
                <li key={d.char}>
                  <button
                    type="button"
                    onClick={() => choose({ kind: "digit", item: d })}
                    aria-pressed={active}
                    aria-label={`${d.char}, ${d.value}`}
                    className={cn(TILE, glyphTile({ active, morph: false }))}
                  >
                    <span lang="th" className="font-thai text-4xl leading-none">
                      {d.char}
                    </span>

                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="tone-title">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h2 id="tone-title" className="mr-2 font-poster text-4xl font-extrabold uppercase leading-none">
              {t.aksornthai.tones}
            </h2>
            <span className="ml-auto text-xs text-ink-soft">
              {t.aksornthai.morphHint}
            </span>
          </div>
          <ul className="flex flex-wrap gap-2">
            {TONE_MARKS.map((m) => {
              const active = sel.kind === "tone" && sel.item.id === m.id;
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => choose({ kind: "tone", item: m })}
                    aria-pressed={active}
                    aria-label={`${m.thai}, ${m.latin}`}
                    className={cn(TILE, glyphTile({ active, morph: MARK_MORPHS.length > 0 }))}
                  >
                    <span lang="th" className="font-thai text-4xl leading-tight">◌{m.char}</span>

                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}

/** Chi tiết dấu thanh: cùng một dấu cho thanh khác nhau theo nhóm phụ âm (âm sống, nguyên âm dài า). */
function ToneDetails({ mark, onTry }: { mark: ToneMark; onTry: () => void }) {
  const t = useT();
  const { locale } = useLocale();
  return (
    <>
      <div className="flex flex-wrap items-baseline gap-3">
        <span lang="th" className="font-thai text-2xl">{mark.thai}</span>
        <span className="text-sm text-ink-soft">{mark.latin}</span>
      </div>
      <p className="text-sm text-ink-soft">{t.aksornthai.markNote}</p>
      <p className="text-sm font-medium">{t.aksornthai.toneByClass}</p>
      <ul className="grid grid-cols-3 gap-2">
        {CLASSES.map((c) => {
          const example = `${CLASS_EXAMPLE[c]}${mark.char}า`;
          const r = resolveTone({ cls: c, liveness: "live", length: "long", mark: mark.id }, locale);
          return (
            <li key={c}>
              <button
                type="button"
                onClick={() => speakThai(example)}
                title={r.irregular}
                className={cn(
                  "flex w-full flex-col bg-paper px-2.5 py-1.5 text-left hover:bg-paper/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                  r.irregular && "border border-dashed border-ink/40",
                )}
              >
                <span className="text-xs font-medium" style={{ color: CLASS_META[c].color }}>
                  {fmt(t.builder.formula.cls, { cls: CLASS_META[c].label[locale] })}
                </span>
                <span lang="th" className="font-thai text-xl leading-snug">{example}</span>
                <span className="text-xs font-semibold" style={{ color: TONE_META[r.tone].color }}>
                  → {fmt(t.builder.formula.tone, { tone: TONE_META[r.tone].label[locale] })}
                </span>
                {r.irregular && <span className="text-xs leading-tight text-ink-soft">{t.builder.rare}</span>}
              </button>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={onTry}
        className="w-fit btn btn-outline btn-xs"
      >
        {t.aksornthai.tryMark} →
      </button>
    </>
  );
}
