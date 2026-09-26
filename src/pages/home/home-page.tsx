"use client";
import Link from "next/link";
import { HeroMerge } from "@/widgets/hero-merge";
import { CLASS_META, type ConsonantClass } from "@/entities/consonant";
import { LEARNING_PATH } from "@/shared/config/routes";
import { useLocale, useT } from "@/shared/i18n";

const GROUP_LETTERS: Record<ConsonantClass, string> = {
  mid: "ก จ ด ต บ ป อ ฎ ฏ",
  high: "ข ฉ ถ ผ ฝ ส ห ศ ษ ฐ",
  low: "ค ช ท พ ฟ ซ ฮ ง น ม ย ร ล ว…",
};

export function HomePage() {
  const t = useT();
  const { locale } = useLocale();
  return (
    <div className="space-y-24">
      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <HeroMerge />
        <div className="max-w-md space-y-5">
          <h1 className="text-3xl font-semibold leading-tight md:text-4xl">{t.home.headline}</h1>
          <p className="text-lg leading-relaxed text-ink/80">{t.home.body}</p>
          <Link href="/lab" className="inline-flex rounded-full bg-ink px-6 py-3 font-medium text-paper hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">
            {t.home.cta}
          </Link>
        </div>
      </section>

      <section aria-labelledby="path-title">
        <h2 id="path-title" className="mb-8 text-2xl font-semibold">{t.home.pathTitle}</h2>
        <ol className="grid gap-px overflow-hidden rounded-3xl bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {LEARNING_PATH.map((p) => (
            <li key={p.href} className="bg-paper">
              <Link href={p.href} className="flex h-full flex-col gap-3 p-6 hover:bg-paper-deep focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink">
                <span className="font-thai text-5xl text-ink/25">{["๑", "๒", "๓", "๔"][p.step - 1]}</span>
                <span className="text-lg font-semibold">{t.routes[p.key].title}</span>
                <span className="text-sm leading-relaxed text-ink-soft">{t.routes[p.key].blurb}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-6 md:grid-cols-3" aria-label={t.home.groupsLabel}>
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
    </div>
  );
}
