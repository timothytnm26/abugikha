"use client";
import { ConsonantChart, ToneContours, VowelChart } from "@/widgets/ipa-explorer";
import { useT } from "@/shared/i18n";
import { PageIntro, PosterHeading, VoiceNotice } from "@/shared/ui";

export function IpaPage() {
  const t = useT();
  return (
    <>
      <PageIntro bg="blue" title={t.ipa.title}>{t.ipa.intro}</PageIntro>
      <div className="page-container pt-6"><VoiceNotice /></div>
      <section aria-labelledby="c-title" className="mt-6">
        <PosterHeading bg="violet" id="c-title">{t.ipa.cTitle}</PosterHeading>
        <div className="page-container py-8 md:py-10">
          <p className="mb-6 max-w-2xl text-ink/85 md:text-lg">{t.ipa.cDesc}</p>
          <ConsonantChart />
        </div>
      </section>
      <section aria-labelledby="v-title">
        <PosterHeading bg="orange" id="v-title">{t.ipa.vTitle}</PosterHeading>
        <div className="page-container py-8 md:py-10">
          <p className="mb-6 max-w-2xl text-ink/85 md:text-lg">{t.ipa.vDesc}</p>
          <VowelChart />
        </div>
      </section>
      <section aria-labelledby="t-title">
        <PosterHeading bg="green" id="t-title">{t.ipa.tTitle}</PosterHeading>
        <div className="page-container py-8 md:py-10">
          <p className="mb-6 max-w-2xl text-ink/85 md:text-lg">{t.ipa.tDesc}</p>
          <ToneContours />
        </div>
      </section>
    </>
  );
}
