"use client";
import { useState } from "react";
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
import { VowelMorph } from "@/entities/syllable";
import { VOWEL_GROUPS, vowelGroup } from "@abugikha/core/vowel";
import { useBuilderStore } from "@/features/build-syllable";
import { fmt, useLocale, useLocalePath, useT } from "@/shared/i18n";
import { cn, tint } from "@/shared/lib";
import { speakThai } from "@/shared/lib/speech";
import { Phonetic, SpeakButton } from "@/shared/ui";

type Selected =
  | { kind: "consonant"; item: Consonant }
  | { kind: "vowel"; item: Vowel }
  | { kind: "digit"; item: ThaiDigit };

const pill = (on: boolean) =>
  cn(
    "rounded-full px-3 py-1 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
    on ? "bg-ink text-paper" : "bg-paper-deep hover:bg-ink/10",
  );

export function AlphabetBoard() {
  const t = useT();
  const { locale } = useLocale();
  const router = useRouter();
  const href = useLocalePath();
  const setPart = useBuilderStore((s) => s.setPart);
  const [sel, setSel] = useState<Selected>({
    kind: "consonant",
    item: CONSONANTS[0],
  });
  const [cls, setCls] = useState<"all" | ConsonantClass>("all");

  const char = sel.kind === "vowel" ? vowelGlyph(sel.item) : sel.item.char;
  const color =
    sel.kind === "consonant"
      ? CLASS_META[sel.item.cls].color
      : "var(--color-ink)";

  const choose = (s: Selected) => {
    setSel(s);
    if (s.kind === "vowel") return;
    speakThai(s.kind === "consonant" ? consonantSpeech(s.item) : s.item.word);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] xl:grid-cols-[minmax(0,1fr)_28rem]">
      {/* Panel viết chữ: trên cùng ở mobile, cột phải cố định ở desktop */}
      <aside
        aria-live="polite"
        className="order-first rounded-xl bg-paper-deep p-5 lg:sticky lg:top-20 lg:order-last lg:self-start"
      >
        <div
          role="img"
          aria-label={char}
          className="mx-auto grid aspect-square w-full max-w-80 place-items-center font-thai text-[10rem] leading-none text-ink"
        >
          {char}
        </div>

        <div className="mt-5 space-y-3 border-t border-ink/10 pt-4">
          {sel.kind === "consonant" ? (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-thai text-3xl">
                  {consonantSpeech(sel.item)}
                </span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium text-on-accent"
                  style={{ backgroundColor: color }}
                >
                  {fmt(t.builder.formula.cls, { cls: CLASS_META[sel.item.cls].label[locale] })}
                </span>
                {sel.item.obsolete && (
                  <span className="rounded-full border border-ink/20 px-2 py-0.5 text-xs text-ink-soft">
                    {t.aksornthai.obsolete}
                  </span>
                )}
              </div>
              <p className="text-sm text-ink-soft">
                {sel.item.name} · {t.aksornthai.keyword}:{" "}
                <span className="font-thai text-base text-ink">
                  {sel.item.word}
                </span>{" "}
                “{sel.item.meaning[locale]}”
              </p>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl bg-paper px-3 py-2">
                  <dt className="text-xs text-ink-soft">
                    {t.aksornthai.initial}
                  </dt>
                  <dd>
                    <Phonetic ipa={sel.item.initial} />
                  </dd>
                </div>
                <div className="rounded-xl bg-paper px-3 py-2">
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
                    className="rounded-full border border-ink/15 px-3 py-1 text-sm font-medium hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    {t.aksornthai.tryIt} →
                  </button>
                )}
              </div>
            </>
          ) : sel.kind === "vowel" ? (
            <>
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-thai text-4xl">
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
                  <span className="font-thai text-xl">
                    {vowelGlyph(sel.item, "closed")}
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
                className="w-fit rounded-full border border-ink/15 px-3 py-1 text-sm font-medium hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                {t.aksornthai.tryVowel} →
              </button>
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-3">
                <span className="font-thai text-3xl">{sel.item.word}</span>
                <Phonetic ipa={sel.item.ipa} className="text-ink-soft" />
              </div>
              <p className="text-sm">
                {t.aksornthai.value}:{" "}
                <span className="font-semibold">{sel.item.value}</span>
              </p>
              <SpeakButton text={sel.item.word} />
            </>
          )}
          <p className="text-[11px] leading-relaxed text-ink-soft">
            {t.aksornthai.traceNote}
          </p>
        </div>
      </aside>

      <div className="space-y-10">
        <section aria-labelledby="cons-title">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h2 id="cons-title" className="mr-2 text-xl font-semibold">
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
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-2">
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
                      "relative flex aspect-square w-full flex-col items-center justify-center rounded-lg transition-[scale] hover:scale-105 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink",
                      (c.common || active) &&
                        `${CLASS_META[c.cls].bg} text-on-accent`,
                      active &&
                        "ring-3 ring-ink ring-offset-2 ring-offset-paper",
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
                    <span
                      className={cn(
                        "font-thai text-4xl leading-none",
                        c.obsolete && "line-through decoration-2",
                      )}
                    >
                      {c.char}
                    </span>
                    <span className="mt-1 font-thai text-[11px] opacity-90">
                      {c.word}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="vowel-title">
          <h2 id="vowel-title" className="mb-4 text-xl font-semibold">
            {t.aksornthai.vowels}
          </h2>
          <div className="space-y-5">
            {VOWEL_GROUPS.map((g) => (
              <div key={g}>
                <h3 className="mb-2 flex flex-wrap items-baseline gap-x-2 text-sm font-semibold">
                  {t.groups.vowels[g]}
                  <span className="text-xs font-normal text-ink-soft">{t.groups.vowelHints[g]}</span>
                </h3>
                {g === "diph" && <p className="mb-2 max-w-2xl text-sm text-ink/80">{t.groups.diphIntro}</p>}
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2">
                  {VOWELS.filter((v) => vowelGroup(v) === g).map((vowel) => {
                    const active = sel.kind === "vowel" && sel.item.id === vowel.id;
                    return (
                      <li key={vowel.id}>
                        <button
                          type="button"
                          onClick={() => choose({ kind: "vowel", item: vowel })}
                          aria-pressed={active}
                          aria-label={`${vowelGlyph(vowel)}, /${vowel.ipa}/, ${vowel.length === "long" ? t.ipa.long : t.ipa.short}`}
                          className={cn(
                            "flex min-h-24 w-full flex-col items-center rounded-lg border border-ink/10 bg-paper-deep px-2 py-3 text-center hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                            // Viền nét đứt = nguyên âm ngắn (cùng quy ước với trang IPA và Ghép chữ)
                            vowel.length === "short" && "border-dashed border-ink/30",
                            active && "ring-3 ring-ink ring-offset-2 ring-offset-paper",
                          )}
                        >
                          <span className="block whitespace-nowrap font-thai text-2xl leading-tight">
                            {vowelGlyph(vowel)}
                          </span>
                          <Phonetic ipa={vowel.ipa} className="mt-1 justify-center text-xs" />
                          <span className="mt-1 block text-xs text-ink-soft">{vowel.approx[locale]}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <VowelMorph focusVowel={sel.kind === "vowel" ? sel.item.id : undefined} />

        <section aria-labelledby="digit-title">
          <h2 id="digit-title" className="mb-4 text-xl font-semibold">
            {t.aksornthai.digits}
          </h2>
          <ul className="grid grid-cols-5 gap-2 sm:grid-cols-10">
            {DIGITS.map((d) => {
              const active = sel.kind === "digit" && sel.item.char === d.char;
              return (
                <li key={d.char}>
                  <button
                    type="button"
                    onClick={() => choose({ kind: "digit", item: d })}
                    aria-pressed={active}
                    aria-label={`${d.char}, ${d.value}`}
                    className={cn(
                      "flex aspect-square w-full flex-col items-center justify-center rounded-lg border-2 hover:scale-105 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink",
                      active
                        ? "border-ink bg-ink text-paper"
                        : "border-ink/15 bg-paper",
                    )}
                  >
                    <span className="font-thai text-3xl leading-none">
                      {d.char}
                    </span>
                    <span className="mt-1 text-[11px] opacity-70">
                      {d.value}
                    </span>
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
