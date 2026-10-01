"use client";
import Link from "next/link";
import { useMemo, useRef, type ReactNode } from "react";
import { CLASS_META, CONSONANT_BY_ID, INITIAL_BY_ID } from "@/entities/consonant";
import { VOWEL_BY_ID } from "@/entities/vowel";
import { SyllableGlyph, TONE_MARK_BY_ID, TONE_META, ToneContour, analyzeSyllable } from "@/entities/syllable";
import { fmt, useLocale, useLocalePath, useT } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { useTileReveal } from "@/shared/lib/use-tile-reveal";
import { Phonetic, PosterFrame, PosterTile, SpeakButton, type PosterBg } from "@/shared/ui";

/**
 * Một mảnh của âm tiết gồm ba ô xếp dọc: dải nhãn màu áp phích (số mảnh, tên, dấu + hoặc =), ô kem có chữ Thái to tô màu theo nghĩa
 * (màu nhóm phụ âm, nguyên âm, âm cuối, thanh) và ô lời giải thích. Màu dải chỉ để trang trí; màu của chữ mới mang nghĩa.
 */
function Piece({ n, strip, tag, color, title, glyph, holder, ipa, small, operator, children }: {
  n: number;
  strip: PosterBg;
  tag: string;
  color: string;
  title: string;
  glyph: ReactNode;
  holder?: string;
  ipa?: string;
  small?: string;
  operator: "+" | "=";
  children: ReactNode;
}) {
  const t = useT();
  return (
    <li className="flex flex-col lg:grid lg:grid-rows-subgrid lg:row-span-3">
      <PosterTile bg={strip} className="flex items-start justify-between gap-3 px-5 py-4 md:px-6">
        <span className="font-poster text-xl font-bold uppercase leading-tight">
          {fmt(t.story.partOf, { n, total: 4 })}
          <span className="block text-base font-semibold normal-case opacity-90">{tag}</span>
        </span>
        <span aria-hidden className="font-poster text-5xl font-extrabold leading-none">{operator}</span>
      </PosterTile>
      <PosterTile bg="cream" themed className="grid place-items-center py-6 text-center">
        <div>
          <span lang="th" className="block font-thai text-[clamp(5rem,9vw,7rem)] leading-[1.3]" style={{ color }}>
            {holder && <span className="text-poster-black/20">{holder}</span>}
            {glyph}
          </span>
          {ipa && <Phonetic ipa={ipa} className="justify-center text-lg" style={{ color }} />}
          {small && <span className="mt-1 block text-xs text-poster-black/70">{small}</span>}
        </div>
      </PosterTile>
      <PosterTile bg="cream" themed className="flex-1 border-t-2 border-poster-black/10 pt-5">
        <h3 className="font-poster text-2xl font-bold uppercase leading-tight">{title}</h3>
        <div className="mt-2 max-w-[34ch] text-sm leading-relaxed">{children}</div>
      </PosterTile>
    </li>
  );
}

/** Giới thiệu cách một âm tiết được ghép nên: bốn mảnh cộng lại thành ค้าน, trình bày như một áp phích gồm các ô phẳng. */
export function SyllableIntro() {
  const t = useT();
  const { locale } = useLocale();
  const href = useLocalePath();
  const root = useRef<HTMLDivElement>(null);
  useTileReveal(root);

  const { a, initial, vowel, final } = useMemo(() => {
    const initial = INITIAL_BY_ID.get("ค")!;
    const vowel = VOWEL_BY_ID.get("aa")!;
    const final = CONSONANT_BY_ID.get("น")!;
    return { a: analyzeSyllable({ initial, vowel, final, mark: "tho" }, locale), initial, vowel, final };
  }, [locale]);
  const tone = TONE_META[a.tone];
  const markChar = TONE_MARK_BY_ID.get("tho")!.char;
  const clsColor = CLASS_META[a.cls].color;

  return (
    <section id="syllable" aria-labelledby="story-title" className="screen scroll-mt-14">
      <div className="page-container w-full py-10 md:py-14">
        <h2 id="story-title" className="max-w-4xl text-balance font-poster text-5xl font-extrabold uppercase leading-[0.98] md:text-7xl">{t.story.title}</h2>
        <p className="mt-4 max-w-[56ch] text-base leading-relaxed text-ink/85 md:text-lg">{t.story.lead}</p>

        <PosterFrame ref={root} className="mt-8 md:mt-10">
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.3fr)] lg:grid-rows-[auto_auto_1fr]">
            <Piece n={1} strip="blue" operator="+" tag={t.story.initial.tag} color={clsColor} title={t.story.initial.title} glyph={initial.chars} ipa={initial.ipa} small={fmt(t.builder.formula.cls, { cls: CLASS_META[a.cls].label[locale] })}>
              {t.story.initial.body}
            </Piece>
            <Piece n={2} strip="violet" operator="+" tag={t.story.vowel.tag} color="var(--color-part-vowel)" title={t.story.vowel.title} holder={initial.chars} glyph={vowel.open.replace("C", "")} ipa={vowel.ipa} small={vowel.approx[locale]}>
              {t.story.vowel.body}
            </Piece>
            <Piece n={3} strip="orange" operator="+" tag={t.story.final.tag} color="var(--color-part-final)" title={t.story.final.title} glyph={final.char} ipa="n" small={t.builder.formula.live}>
              {t.story.final.body}
            </Piece>
            <Piece n={4} strip="green" operator="=" tag={t.story.mark.tag} color={tone.color} title={t.story.mark.title} holder={initial.chars} glyph={markChar} small={`${CLASS_META[a.cls].label[locale]} + ◌${markChar} = ${tone.label[locale]}`}>
              <p>{t.story.mark.body}</p>
              <ToneContour tone={a.tone} className="mt-3 w-16" strokeWidth={4} />
            </Piece>

            <li className="flex flex-col sm:col-span-2 lg:col-span-1 lg:grid lg:grid-rows-subgrid lg:row-span-3">
              <PosterTile bg="lime" className="px-5 py-4 md:px-6">
                <span className="font-poster text-xl font-bold uppercase leading-tight">{t.story.result.tag}</span>
              </PosterTile>
              <PosterTile bg="lime" themed className="grid place-items-center py-6 text-center">
                <div>
                  <SyllableGlyph analysis={a} className="block text-[clamp(5.5rem,10vw,8rem)] leading-[1.35]" />
                  <Phonetic ipa={a.ipa} className="justify-center text-xl" style={{ color: "var(--color-poster-black)" }} />
                </div>
              </PosterTile>
              <PosterTile bg="lime" themed className="flex flex-1 flex-col gap-3 border-t-2 border-poster-black/15 pt-5">
                <h3 className="font-poster text-2xl font-bold uppercase leading-tight">{t.story.result.title}</h3>
                <p className="text-sm leading-relaxed">{t.story.result.body}</p>
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
                  <Link href={href("/lab")} className={cn("btn btn-primary btn-sm")}>
                    {t.story.result.cta} →
                  </Link>
                  <SpeakButton text={a.spelling} />
                </div>
              </PosterTile>
            </li>
          </ol>
        </PosterFrame>
      </div>
    </section>
  );
}
