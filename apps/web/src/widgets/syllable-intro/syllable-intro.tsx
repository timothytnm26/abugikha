"use client";
import Link from "next/link";
import { useMemo, useRef, type ReactNode } from "react";
import { CLASS_META, CONSONANT_BY_ID, INITIAL_BY_ID } from "@/entities/consonant";
import { VOWEL_BY_ID } from "@/entities/vowel";
import { SyllableGlyph, TONE_MARK_BY_ID, TONE_META, ToneContour, analyzeSyllable } from "@/entities/syllable";
import { fmt, useLocale, useLocalePath, useT } from "@/shared/i18n";
import { onTint, tint } from "@/shared/lib";
import { gsap, useGSAP } from "@/shared/lib/gsap";
import { Phonetic, SpeakButton } from "@/shared/ui";

function Piece({ n, tag, color, title, glyph, holder, ipa, small, operator, children }: {
  n: number;
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
    <li className="syl-piece relative">
      <div data-tape className="note-paper flex h-full flex-col rounded-3xl border-2 p-5 pt-7" style={{ borderColor: color }}>
        <span className="self-start rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: tint(color, 16), color: onTint(color) }}>
          {fmt(t.story.partOf, { n, total: 4 })} · {tag}
        </span>
        <div className="my-3 grid min-h-32 place-items-center text-center">
          <div>
            <span lang="th" className="note-glyph block font-thai text-[5.5rem] leading-[1.3]" style={{ color }}>
              {holder && <span className="text-ink/20">{holder}</span>}
              {glyph}
            </span>
            {ipa && <Phonetic ipa={ipa} className="justify-center text-lg" style={{ color }} />}
            {small && <span className="mt-1 block text-xs text-ink-soft">{small}</span>}
          </div>
        </div>
        <h3 className="text-lg font-semibold leading-snug">{title}</h3>
        <div className="mt-1.5 text-sm leading-relaxed text-ink/80">{children}</div>
      </div>
      <span aria-hidden className="absolute -bottom-4 left-1/2 z-10 grid size-8 -translate-x-1/2 place-items-center rounded-full bg-ink text-lg font-semibold leading-none text-paper sm:hidden lg:-right-5 lg:bottom-auto lg:left-auto lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0 lg:grid">
        {operator}
      </span>
    </li>
  );
}

/** Giới thiệu cách một âm tiết được ghép nên: bốn mảnh cộng lại thành ค้าน, xếp dọc và hiện dần khi cuộn tới. */
export function SyllableIntro() {
  const t = useT();
  const { locale } = useLocale();
  const href = useLocalePath();
  const root = useRef<HTMLElement>(null);

  const { a, initial, vowel, final } = useMemo(() => {
    const initial = INITIAL_BY_ID.get("ค")!;
    const vowel = VOWEL_BY_ID.get("aa")!;
    const final = CONSONANT_BY_ID.get("น")!;
    return { a: analyzeSyllable({ initial, vowel, final, mark: "tho" }, locale), initial, vowel, final };
  }, [locale]);
  const tone = TONE_META[a.tone];
  const markChar = TONE_MARK_BY_ID.get("tho")!.char;
  const clsColor = CLASS_META[a.cls].color;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".syl-head > *", { y: 24, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out", scrollTrigger: { trigger: ".syl-head", start: "top 85%", once: true } });
        gsap.from(".syl-piece", { y: 48, opacity: 0, rotate: -2, duration: 0.7, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: ".syl-grid", start: "top 80%", once: true } });
        gsap.from(".syl-result", { scale: 0.9, duration: 0.8, ease: "elastic.out(1, 0.5)", scrollTrigger: { trigger: ".syl-result", start: "top 85%", once: true } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="syllable" aria-labelledby="story-title" className="screen scroll-mt-14">
      <div className="page-container py-14 md:py-16">
        <div className="syl-head mx-auto max-w-2xl text-center">
          <h2 id="story-title" className="text-3xl font-semibold leading-tight md:text-5xl">{t.story.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-ink/80 md:text-lg">{t.story.lead}</p>
        </div>

        <ol className="syl-grid mt-10 grid gap-8 md:mt-14 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <Piece n={1} operator="+" tag={t.story.initial.tag} color={clsColor} title={t.story.initial.title} glyph={initial.chars} ipa={initial.ipa} small={fmt(t.builder.formula.cls, { cls: CLASS_META[a.cls].label[locale] })}>
            {t.story.initial.body}
          </Piece>
          <Piece n={2} operator="+" tag={t.story.vowel.tag} color="var(--color-part-vowel)" title={t.story.vowel.title} holder={initial.chars} glyph={vowel.open.replace("C", "")} ipa={vowel.ipa} small={vowel.approx[locale]}>
            {t.story.vowel.body}
          </Piece>
          <Piece n={3} operator="+" tag={t.story.final.tag} color="var(--color-part-final)" title={t.story.final.title} glyph={final.char} ipa="n" small={t.builder.formula.live}>
            {t.story.final.body}
          </Piece>
          <Piece n={4} operator="=" tag={t.story.mark.tag} color={tone.color} title={t.story.mark.title} holder={initial.chars} glyph={markChar} small={`${CLASS_META[a.cls].label[locale]} + ◌${markChar} = ${tone.label[locale]}`}>
            <p>{t.story.mark.body}</p>
            <ToneContour tone={a.tone} className="mt-3 w-16" strokeWidth={4} />
          </Piece>

          <li className="syl-result">
            <div data-tape className="note-paper flex h-full flex-col rounded-3xl border-2 p-5 pt-7" style={{ borderColor: tone.color }}>
              <span className="self-start rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: tint(tone.color, 16), color: onTint(tone.color) }}>{t.story.result.tag}</span>
              <div className="my-3 grid min-h-32 place-items-center text-center">
                <div>
                  <SyllableGlyph analysis={a} className="note-glyph block text-[5.5rem] leading-[1.35]" />
                  <Phonetic ipa={a.ipa} className="justify-center text-lg" style={{ color: tone.color }} />
                </div>
              </div>
              <h3 className="text-lg font-semibold leading-snug">{t.story.result.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/80">{t.story.result.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={href("/lab")} className="btn btn-primary btn-sm">
                  {t.story.result.cta} →
                </Link>
                <SpeakButton text={a.spelling} />
              </div>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
