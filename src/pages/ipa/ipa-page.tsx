"use client";
import { ConsonantChart, ToneContours, VowelChart } from "@/widgets/ipa-explorer";
import { useT } from "@/shared/i18n";
import { PageIntro, VoiceNotice } from "@/shared/ui";

export function IpaPage() {
  const t = useT();
  return (
    <>
      <PageIntro title={t.ipa.title}>{t.ipa.intro}</PageIntro>
      <div className="mb-10"><VoiceNotice /></div>
      <div className="space-y-20">
        <section aria-labelledby="c-title">
          <h2 id="c-title" className="mb-2 text-2xl font-semibold">{t.ipa.cTitle}</h2>
          <p className="mb-6 max-w-2xl text-ink-soft">{t.ipa.cDesc}</p>
          <ConsonantChart />
        </section>
        <section aria-labelledby="v-title">
          <h2 id="v-title" className="mb-2 text-2xl font-semibold">{t.ipa.vTitle}</h2>
          <p className="mb-6 max-w-2xl text-ink-soft">{t.ipa.vDesc}</p>
          <VowelChart />
        </section>
        <section aria-labelledby="t-title">
          <h2 id="t-title" className="mb-2 text-2xl font-semibold">{t.ipa.tTitle}</h2>
          <p className="mb-6 max-w-2xl text-ink-soft">{t.ipa.tDesc}</p>
          <ToneContours />
        </section>
      </div>
    </>
  );
}
