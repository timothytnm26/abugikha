"use client";
import { ConsonantChart, ToneContours, VowelChart } from "@/widgets/ipa-explorer";
import { useT } from "@/shared/i18n";
import { PageIntro, SectionHeading, VoiceNotice } from "@/shared/ui";

export function IpaPage() {
  const t = useT();
  return (
    <>
      <PageIntro title={t.ipa.title}>{t.ipa.intro}</PageIntro>
      <div className="page-container pt-6"><VoiceNotice /></div>
      <section aria-labelledby="c-title">
        <SectionHeading id="c-title" label="IPA">{t.ipa.cTitle}</SectionHeading>
        <div className="page-container py-6 md:py-8">
          <p className="mb-6 max-w-2xl text-ink/85 md:text-lg">{t.ipa.cDesc}</p>
          <ConsonantChart />
        </div>
      </section>
      <section aria-labelledby="v-title">
        <SectionHeading id="v-title" label="IPA">{t.ipa.vTitle}</SectionHeading>
        <div className="page-container py-6 md:py-8">
          <p className="mb-6 max-w-2xl text-ink/85 md:text-lg">{t.ipa.vDesc}</p>
          <VowelChart />
        </div>
      </section>
      <section aria-labelledby="t-title">
        <SectionHeading id="t-title" label="IPA">{t.ipa.tTitle}</SectionHeading>
        <div className="page-container py-6 md:py-8">
          <p className="mb-6 max-w-2xl text-ink/85 md:text-lg">{t.ipa.tDesc}</p>
          <ToneContours />
        </div>
      </section>
    </>
  );
}
