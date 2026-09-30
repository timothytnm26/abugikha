"use client";
import Link from "next/link";
import { HeroMerge } from "@/widgets/hero-merge";
import { SyllableStory } from "@/widgets/syllable-story";
import { CLASS_META, type ConsonantClass } from "@/entities/consonant";
import { LEARNING_PATH } from "@/shared/config/routes";
import { useLocale, useT } from "@/shared/i18n";

const GROUP_LETTERS: Record<ConsonantClass, string> = {
  mid: "ก จ ด ต บ ป อ ฎ ฏ",
  high: "ข ฉ ถ ผ ฝ ส ห ศ ษ ฐ",
  low: "ค ช ท พ ฟ ซ ฮ ง น ม ย ร ล ว…",
};

/** Chữ trôi lơ lửng phía sau phần mở đầu; chỉ để trang trí. */
const FLOATERS = [
  { ch: "ก", cls: "right-[3%] top-[2%] text-7xl text-mid", d: "0s" },
  { ch: "๑", cls: "right-[38%] top-[1%] text-5xl text-tone-high", d: "1.2s" },
  { ch: "ข", cls: "right-[1%] bottom-[3%] text-6xl text-high", d: "1.8s" },
  { ch: "เ", cls: "right-[42%] bottom-[1%] text-6xl text-vowel", d: "0.3s" },
  { ch: "ม", cls: "right-[24%] bottom-[0%] text-5xl text-low", d: "2.1s" },
];

export function HomePage() {
  const t = useT();
  const { locale } = useLocale();
  const container = "mx-auto w-full max-w-[1440px] px-4 md:px-6";
  return (
    <div>
      <section className={`${container} relative overflow-hidden py-8 md:py-14`}>
        <div aria-hidden className="pointer-events-none absolute inset-0 select-none font-thai opacity-[0.16]">
          {FLOATERS.map((f) => (
            <span key={f.ch} className={`absolute ${f.cls} [animation:float-soft_6s_ease-in-out_infinite]`} style={{ animationDelay: f.d }}>
              {f.ch}
            </span>
          ))}
        </div>
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div className="max-w-xl space-y-4 md:space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full bg-paper-deep px-3.5 py-1.5 text-xs font-medium text-ink-soft sm:text-sm">
              <svg aria-hidden viewBox="0 0 24 24" className="size-4 fill-tone-falling"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 5 6.4 5c2 0 3.600 1.100 5.600 3.200C14 6.100 15.600 5 17.600 5c3.400 0 5.500 3.400 4 6.800C19.500 16.400 12 21 12 21z" /></svg>
              <span><span className="font-thai">น่ารักไทย</span> · {t.home.eyebrow}</span>
            </p>
            <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight md:text-5xl">{t.home.headline}</h1>
            <p className="text-base leading-relaxed text-ink/80 md:text-lg">{t.home.body}</p>
            <p className="text-sm leading-relaxed text-ink-soft"><span className="font-thai">“น่ารัก”</span> {t.home.tagline}</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link href="/lab" className="inline-flex min-h-12 items-center rounded-full bg-ink px-6 py-3 font-medium text-paper hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">
                {t.home.cta}
              </Link>
              <Link href="/abugida" className="inline-flex min-h-12 items-center rounded-full border border-ink/20 px-6 py-3 font-medium hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">
                {t.home.ctaSecondary}
              </Link>
            </div>
          </div>
          <div data-tape data-fold className="note-paper rounded-3xl px-4 pb-8 pt-10 md:px-8">
            <HeroMerge />
          </div>
        </div>
      </section>

      <SyllableStory />

      <div className={`${container} space-y-16 py-12 md:space-y-24 md:py-20`}>
        <section aria-labelledby="path-title">
          <div className="mb-6 md:mb-8">
            <h2 id="path-title" className="text-2xl font-semibold md:text-3xl">{t.home.pathTitle}</h2>
            <p className="mt-1 text-ink-soft">{t.home.pathBlurb}</p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LEARNING_PATH.map((p, i) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  data-tape
                  className="note-paper flex h-full flex-col gap-3 rounded-2xl p-5 pt-6 transition-[translate,rotate] duration-200 hover:-translate-y-1 hover:rotate-[-0.6deg] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                >
                  <span className="note-glyph font-thai text-5xl leading-none" style={{ color: ["var(--color-mid)", "var(--color-tone-falling)", "var(--color-vowel)", "var(--color-low)"][i] }}>
                    {["๑", "๒", "๓", "๔"][p.step - 1]}
                  </span>
                  <span className="text-lg font-semibold">{t.routes[p.key].title}</span>
                  <span className="text-sm leading-relaxed text-ink-soft">{t.routes[p.key].blurb}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-4 md:grid-cols-3 md:gap-6" aria-label={t.home.groupsLabel}>
          {(["mid", "high", "low"] as const).map((c) => (
            <div key={c} className={`${CLASS_META[c].bg} rounded-3xl p-6 text-on-accent`}>
              <p className="text-xl font-semibold">
                {t.home.groupName(CLASS_META[c].label[locale])} <span className="font-thai font-normal opacity-80">{CLASS_META[c].thai}</span>
              </p>
              <p className="mt-4 font-thai text-3xl leading-snug">{GROUP_LETTERS[c]}</p>
              <p className="mt-4 text-sm leading-relaxed opacity-90">{t.home.groupNotes[c]}</p>
            </div>
          ))}
        </section>

        <section data-tape className="note-paper rounded-3xl px-6 py-10 text-center md:py-14">
          <h2 className="text-2xl font-semibold md:text-3xl">{t.home.footerTitle}</h2>
          <p className="mx-auto mt-2 max-w-md text-ink-soft">{t.home.footerBody}</p>
          <Link href="/lab" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-ink px-6 py-3 font-medium text-paper hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">
            {t.home.cta}
          </Link>
        </section>
      </div>
    </div>
  );
}
