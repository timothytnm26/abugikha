"use client";
import Link from "next/link";
import { useMemo, useRef, type ReactNode } from "react";
import { CLASS_META, CONSONANT_BY_ID, INITIAL_BY_ID } from "@/entities/consonant";
import { VOWEL_BY_ID } from "@/entities/vowel";
import {
  SyllableGlyph,
  TONE_MARK_BY_ID,
  TONE_META,
  ToneContour,
  analyzeSyllable,
  type SegmentRole,
} from "@/entities/syllable";
import { useLocale, useT } from "@/shared/i18n";
import { tint } from "@/shared/lib";
import { gsap, useGSAP } from "@/shared/lib/gsap";
import { Phonetic, SpeakButton } from "@/shared/ui";

/** Mảnh nào của âm tiết hiện ra ở khung nào (khung 0 là phần mở đầu). */
const PART_OF_ROLE: Record<SegmentRole, number> = { initial: 1, vowel: 2, final: 3, mark: 4 };
const RESULT_PANEL = 5;

function Panel({ card, tag, tagColor, title, children }: { card: ReactNode; tag: string; tagColor: string; title: string; children: ReactNode }) {
  return (
    <div className="story-panel flex h-full w-screen shrink-0 items-center justify-center px-5 pb-32 md:px-12 md:pb-36">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 md:flex-row md:gap-14">
        {card}
        <div className="story-text max-w-md text-center md:text-left">
          <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: tint(tagColor, 16), color: tagColor }}>
            {tag}
          </span>
          <h3 className="mt-2 text-xl font-semibold leading-snug sm:text-2xl md:mt-3 md:text-3xl">{title}</h3>
          <div className="mt-2 text-sm leading-relaxed text-ink/80 sm:text-base md:mt-3 md:text-lg">{children}</div>
        </div>
      </div>
    </div>
  );
}

/** `holder` = phụ âm mờ để thấy mảnh này nằm ở đâu so với phụ âm (dùng cho nguyên âm và dấu thanh). */
function PartCard({ glyph, color, ipa, small, holder }: { glyph: string; color: string; ipa?: string; small?: string; holder?: string }) {
  return (
    <div
      data-tape
      className="story-card note-paper grid h-36 w-52 shrink-0 place-items-center rounded-3xl border-2 md:h-72 md:w-80"
      style={{ borderColor: color }}
    >
      <div className="text-center">
        <span className="note-glyph block font-thai text-[5.5rem] leading-[1.3] md:text-[9rem]" style={{ color }}>
          {holder && <span className="text-ink/20">{holder}</span>}
          {glyph}
        </span>
        {ipa && <Phonetic ipa={ipa} className="justify-center text-base md:text-xl" style={{ color }} />}
        {small && <span className="mt-1 block text-xs text-ink-soft">{small}</span>}
      </div>
    </div>
  );
}

/**
 * Câu chuyện cuộn ngang: khi cuộn xuống, khung hình bị ghim lại và trượt ngang qua từng mảnh của
 * ค้าน (phụ âm → nguyên âm → âm cuối → dấu thanh). Dải giấy bên dưới hiện dần từng chữ đúng màu.
 */
export function SyllableStory() {
  const t = useT();
  const { locale } = useLocale();
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

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
        const el = track.current!;
        const box = stage.current!;
        const distance = () => el.scrollWidth - box.clientWidth;
        const trigger = { trigger: box, start: "top top+=56", end: () => `+=${distance()}`, invalidateOnRefresh: true };
        const slide = gsap.to(el, { x: () => -distance(), ease: "none", scrollTrigger: { ...trigger, pin: true, scrub: 0.6, anticipatePin: 1 } });
        gsap.to(".story-progress", { scaleX: 1, ease: "none", scrollTrigger: { ...trigger, scrub: true } });

        gsap.utils.toArray<HTMLElement>(".story-panel").forEach((panel, i) => {
          const at = (start: string, end: string) => ({ trigger: panel, containerAnimation: slide, start, end, scrub: true });
          gsap.fromTo(panel.querySelector(".story-card"), { scale: 0.7, rotate: -7, opacity: 0.25 }, { scale: 1, rotate: 0, opacity: 1, ease: "none", scrollTrigger: at("left 95%", "left 50%") });
          gsap.fromTo(panel.querySelector(".story-text"), { y: 36, opacity: 0 }, { y: 0, opacity: 1, ease: "none", scrollTrigger: at("left 85%", "left 45%") });
          gsap.fromTo(panel.querySelectorAll(".story-float"), { yPercent: 30 }, { yPercent: -30, ease: "none", scrollTrigger: at("left 100%", "right 0%") });
          const parts = gsap.utils.toArray<HTMLElement>(`[data-part="${i}"]`, box);
          if (parts.length) {
            gsap.to(parts, {
              opacity: 1,
              duration: 0.4,
              ease: "back.out(2)",
              scrollTrigger: { trigger: panel, containerAnimation: slide, start: "left 55%", toggleActions: "play none none reverse" },
            });
          }
          if (i === RESULT_PANEL) {
            gsap.fromTo(
              ".story-strip",
              { scale: 1 },
              { scale: 1.1, duration: 0.35, yoyo: true, repeat: 1, ease: "power2.out", scrollTrigger: { trigger: panel, containerAnimation: slide, start: "left 55%", toggleActions: "play none none none" } },
            );
          }
        });
      });
      // Giảm chuyển động: xếp dọc, hiện đủ chữ, không ghim
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(stage.current, { height: "auto" });
        gsap.set(track.current, { flexDirection: "column" });
        gsap.set(".story-panel", { width: "100%", height: "auto", paddingBlock: "3rem" });
        gsap.set(".story-strip-wrap", { position: "relative", bottom: "auto", paddingBottom: "2rem" });
        gsap.set("[data-part]", { opacity: 1 });
      });
    },
    { scope: stage },
  );

  const dots = [1, 2, 3, 4];

  return (
    <section aria-labelledby="story-title" className="relative">
      <div ref={stage} className="relative h-[calc(100svh-3.5rem)] min-h-[32rem] overflow-hidden bg-paper-deep">
        {/* Thanh tiến trình */}
        <div className="absolute inset-x-0 top-0 z-10 h-1.5 bg-ink/10" aria-hidden>
          <div className="story-progress h-full origin-left scale-x-0" style={{ background: `linear-gradient(90deg, ${clsColor}, var(--color-vowel), var(--color-final), ${tone.color})` }} />
        </div>

        <div ref={track} className="flex h-full w-max will-change-transform">
          {/* Mở đầu */}
          <div className="story-panel flex h-full w-screen shrink-0 items-center justify-center px-5 pb-32 md:px-12 md:pb-36">
            <div className="story-text mx-auto max-w-2xl text-center">
              <h2 id="story-title" className="text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">{t.story.title}</h2>
              <p className="mt-4 text-base leading-relaxed text-ink/80 md:text-xl">{t.story.lead}</p>
              <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2 text-sm font-medium text-ink-soft">
                {t.home.scrollCue}
                <svg aria-hidden viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2 [animation:nudge-x_1.4s_ease-in-out_infinite]" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </p>
            </div>
          </div>

          <Panel
            tag={`${t.story.partOf(1, 4)} · ${t.story.initial.tag}`}
            tagColor={clsColor}
            title={t.story.initial.title}
            card={<PartCard glyph={initial.chars} color={clsColor} ipa={initial.ipa} small={t.builder.formula.cls(CLASS_META[a.cls].label[locale])} />}
          >
            {t.story.initial.body}
          </Panel>

          <Panel
            tag={`${t.story.partOf(2, 4)} · ${t.story.vowel.tag}`}
            tagColor="var(--color-vowel)"
            title={t.story.vowel.title}
            card={<PartCard holder={initial.chars} glyph={vowel.open.replace("C", "")} color="var(--color-vowel)" ipa={vowel.ipa} small={vowel.approx[locale]} />}
          >
            {t.story.vowel.body}
          </Panel>

          <Panel
            tag={`${t.story.partOf(3, 4)} · ${t.story.final.tag}`}
            tagColor="var(--color-final)"
            title={t.story.final.title}
            card={<PartCard glyph={final.char} color="var(--color-final)" ipa="n" small={t.builder.formula.live} />}
          >
            {t.story.final.body}
          </Panel>

          <Panel
            tag={`${t.story.partOf(4, 4)} · ${t.story.mark.tag}`}
            tagColor={tone.color}
            title={t.story.mark.title}
            card={
              <PartCard
                holder={initial.chars}
                glyph={markChar}
                color={tone.color}
                small={`${CLASS_META[a.cls].label[locale]} + ◌${markChar} = ${tone.label[locale]}`}
              />
            }
          >
            <p>{t.story.mark.body}</p>
            <ToneContour tone={a.tone} className="mx-auto mt-3 w-16 md:mx-0" strokeWidth={4} />
          </Panel>

          <Panel
            tag={t.story.result.tag}
            tagColor={tone.color}
            title={t.story.result.title}
            card={
              <div data-tape className="story-card note-paper grid h-36 w-52 shrink-0 place-items-center rounded-3xl border-2 md:h-72 md:w-80" style={{ borderColor: tone.color }}>
                <div className="text-center">
                  <SyllableGlyph analysis={a} className="note-glyph block text-[5.5rem] leading-[1.35] md:text-[9rem]" />
                  <Phonetic ipa={a.ipa} className="justify-center text-base md:text-xl" style={{ color: tone.color }} />
                </div>
              </div>
            }
          >
            <p>{t.story.result.body}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
              <Link href="/lab" className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">
                {t.story.result.cta} →
              </Link>
              <SpeakButton text={a.spelling} className="min-h-11" />
            </div>
          </Panel>
        </div>

        {/* Dải giấy: âm tiết hiện dần từng chữ khi cuộn qua từng mảnh */}
        <div className="story-strip-wrap pointer-events-none absolute inset-x-0 bottom-4 z-10 flex flex-col items-center gap-2 md:bottom-6">
          <div data-tape className="story-strip note-paper rounded-2xl px-8 py-1 [--u:1.75rem]" aria-label={a.spelling}>
            <span className="font-thai text-5xl leading-[1.5] md:text-6xl" aria-hidden>
              {a.segments.map((s, i) => {
                const color = s.role === "initial" ? clsColor : s.role === "mark" ? tone.color : s.role === "vowel" ? "var(--color-vowel)" : "var(--color-final)";
                return (
                  <span key={i} data-part={PART_OF_ROLE[s.role]} className="opacity-15" style={{ color }}>
                    {s.text}
                  </span>
                );
              })}
            </span>
          </div>
          <ol className="flex items-center gap-1.5" aria-hidden>
            {dots.map((n) => (
              <li key={n} data-part={n} className="size-2.5 rounded-full bg-ink opacity-15" />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
