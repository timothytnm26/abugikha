"use client";
import { SyllableBuilder } from "@/widgets/syllable-builder";
import { ClassLegend } from "@/entities/consonant";
import { useT } from "@/shared/i18n";
import { PageIntro, VoiceNotice } from "@/shared/ui";

export function BuilderPage() {
  const t = useT();
  return (
    <>
      <PageIntro compact title={t.routes.builder.title}>{t.routes.builder.blurb}</PageIntro>
      <div className="page-container py-6 md:py-8 xl:py-2">
        <div className="mb-4 xl:mb-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <VoiceNotice />
          <ClassLegend className="ml-auto" />
        </div>
        <SyllableBuilder />
      </div>
    </>
  );
}
