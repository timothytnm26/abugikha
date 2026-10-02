'use client';
import { useMemo, useRef, type ReactNode } from 'react';
import { CLASS_META, CONSONANT_BY_ID, INITIAL_BY_ID } from '@/entities/consonant';
import { VOWEL_BY_ID } from '@/entities/vowel';
import { vowelGroup } from '@abugikha/core/vowel';
import { SyllableGlyph, TONE_MARK_BY_ID, TONE_META, ToneContour, analyzeSyllable } from '@/entities/syllable';
import { fmt, useLocale, useLocalePath, useT } from '@/shared/i18n';
import { cn } from '@/shared/lib';
import { ROLE_TILE_COLOR, chipTile, toneTileColor, vowelTileColor, washBox, type TileColor } from '@/shared/lib';
import { gsap, useGSAP } from '@/shared/lib/gsap';
import { Asterisk, Phonetic, SpeakButton, Tape } from '@/shared/ui';

/** Dấu + hoặc = nằm trên đường kẻ bên trái của cột (chỉ màn hình lớn). */
function Operator({ children }: { children: string }) {
  return (
    <span aria-hidden className="absolute -left-[0.8rem] top-0 hidden select-none bg-paper font-poster text-3xl font-bold leading-none text-note-taupe lg:block">
      {children}
    </span>
  );
}

/** Một mảnh của âm tiết: số mảnh, chữ Thái khổng lồ tô màu theo nghĩa, phiên âm, tên và lời giải thích. Cột nào cũng cùng cấu trúc để cuộn tới là đọc liền. */
function Piece({
  n,
  tag,
  tile,
  title,
  glyph,
  holder,
  ipa,
  small,
  first,
  children,
}: {
  n: number;
  tag: string;
  /** Màu của mảnh: cùng bộ màu với ô chữ ở Bảng chữ và phần xem trước */
  tile: TileColor;
  title: string;
  glyph: ReactNode;
  holder?: string;
  ipa?: string;
  small?: string;
  /** Mảnh đầu tiên không có dấu + phía trước */
  first?: boolean;
  children: ReactNode;
}) {
  const t = useT();
  const box = washBox({ tile });
  return (
    <li className="syl-piece relative min-w-0 lg:border-l-2 lg:border-ink/30 lg:pl-8 lg:first:border-l-0 lg:first:pl-0">
      <p className="flex flex-wrap items-center gap-2 font-poster text-lg font-bold uppercase leading-none text-ink-soft">
        <span {...chipTile({ tile })} className="rounded-lg px-2.5 py-1 font-poster text-sm font-bold uppercase leading-none">
          {fmt(t.story.partOf, { n, total: 4 })}
        </span>
        {tag}
      </p>
      <span lang="th" {...box} className={cn('mt-3 inline-block px-5 font-thai text-[clamp(4.5rem,7.5vw,6.5rem)] leading-[1.2]', box.className)}>
        {holder && <span className="opacity-30">{holder}</span>}
        {glyph}
      </span>
      {ipa && <Phonetic ipa={ipa} className="block text-lg" style={{ color: tile.ink }} />}
      {small && <span className="mt-1 block text-xs text-ink-soft">{small}</span>}
      <h3 className="mt-4 font-poster text-2xl font-bold uppercase leading-tight">{title}</h3>
      <div className="mt-2 max-w-[34ch] text-sm leading-relaxed text-ink/85">{children}</div>
      {!first && <Operator>+</Operator>}
    </li>
  );
}

/** Giới thiệu cách một âm tiết được ghép nên. Màn hình lớn: ghim lại và sáng dần từng mảnh theo thanh cuộn, đến cuối ra ค้าน. */
export function SyllableIntro() {
  const t = useT();
  const { locale } = useLocale();
  const href = useLocalePath();
  const root = useRef<HTMLElement>(null);

  const { a, initial, vowel, final } = useMemo(() => {
    const initial = INITIAL_BY_ID.get('ค')!;
    const vowel = VOWEL_BY_ID.get('aa')!;
    const final = CONSONANT_BY_ID.get('น')!;
    return { a: analyzeSyllable({ initial, vowel, final, mark: 'tho' }, locale), initial, vowel, final };
  }, [locale]);
  const tone = TONE_META[a.tone];
  const markChar = TONE_MARK_BY_ID.get('tho')!.char;
  const toneTile = toneTileColor(a.tone);
  const vowelTile = vowelTileColor(vowelGroup(vowel));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const pieces = gsap.utils.toArray<HTMLElement>('.syl-piece', root.current);
        gsap.set(pieces, { opacity: 0.14 });
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top+=56', end: '+=220%', pin: true, scrub: 0.6 } });
        pieces.forEach((p, i) => tl.to(p, { opacity: 1, duration: 1, ease: 'none' }, i));
        tl.to({}, { duration: 0.6 });
      });
      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.syl-piece', root.current).forEach((p) => {
          gsap.from(p, { opacity: 0.15, y: 28, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: p, start: 'top 85%', once: true } });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="syllable" aria-labelledby="story-title" className="scroll-mt-14">
      <div className="page-container flex min-h-[calc(100svh-3.5rem)] flex-col justify-center py-12 md:py-14">
        <Asterisk className="size-7 text-note-orange" />
        <h2 id="story-title" className="mt-3 max-w-5xl text-balance font-poster text-5xl font-extrabold uppercase leading-[0.95] md:text-7xl">
          {t.story.title}
        </h2>
        <p className="mt-3 max-w-[56ch] text-base leading-relaxed text-ink-soft">{t.story.lead}</p>

        <ol className="mt-8 grid gap-12 sm:grid-cols-2 lg:mt-10 lg:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.3fr)] lg:gap-0">
          <Piece n={1} first tag={t.story.initial.tag} tile={ROLE_TILE_COLOR.initial} title={t.story.initial.title} glyph={initial.chars} ipa={initial.ipa} small={fmt(t.builder.formula.cls, { cls: CLASS_META[a.cls].label[locale] })}>
            {t.story.initial.body}
          </Piece>
          <Piece n={2} tag={t.story.vowel.tag} tile={vowelTile} title={t.story.vowel.title} holder={initial.chars} glyph={vowel.open.replace('C', '')} ipa={vowel.ipa} small={vowel.approx[locale]}>
            {t.story.vowel.body}
          </Piece>
          <Piece n={3} tag={t.story.final.tag} tile={ROLE_TILE_COLOR.final} title={t.story.final.title} glyph={final.char} ipa="n" small={t.builder.formula.live}>
            {t.story.final.body}
          </Piece>
          <Piece n={4} tag={t.story.mark.tag} tile={toneTile} title={t.story.mark.title} holder={initial.chars} glyph={markChar} small={`${CLASS_META[a.cls].label[locale]} + ◌${markChar} = ${tone.label[locale]}`}>
            <p>{t.story.mark.body}</p>
            <ToneContour tone={a.tone} className="mt-3 w-16" strokeWidth={4} />
          </Piece>

          <li className="syl-piece relative min-w-0 sm:col-span-2 lg:col-span-1 lg:border-l-2 lg:border-ink/30 lg:pl-8">
            <Operator>=</Operator>
            <p className="font-poster text-lg font-bold uppercase leading-none text-ink-soft">{t.story.result.tag}</p>
            <span {...washBox({ tile: toneTile })} className={cn('mt-3 inline-block px-5', washBox({ tile: toneTile }).className)}>
              <SyllableGlyph analysis={a} className="block text-[clamp(5rem,8.5vw,7.5rem)] leading-[1.25]" />
            </span>
            <Phonetic ipa={a.ipa} className="block text-xl" style={{ color: toneTile.ink }} />
            <h3 className="mt-4 font-poster text-2xl font-bold uppercase leading-tight">{t.story.result.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/85">{t.story.result.body}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Tape href={href('/lab')} color={toneTile.color}>
                {t.story.result.cta} →
              </Tape>
              <SpeakButton text={a.spelling} bare />
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
