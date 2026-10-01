"use client";
import { SyllableBuilder } from "@/widgets/syllable-builder";
import { ClassLegend } from "@/entities/consonant";
import { useT } from "@/shared/i18n";
import { PageIntro, VoiceNotice } from "@/shared/ui";

export function BuilderPage() {
  const t = useT();
  return (
    <>
      <PageIntro bg="orange" title={t.routes.builder.title} compact>{t.routes.builder.blurb}</PageIntro>
      <div className="page-container py-6 md:py-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <VoiceNotice />
          <ClassLegend className="ml-auto" />
        </div>
        <SyllableBuilder />
      </div>
    </>
  );
}
