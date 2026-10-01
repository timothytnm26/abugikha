"use client";
import { SyllableBuilder } from "@/widgets/syllable-builder";
import { ClassLegend } from "@/entities/consonant";
import { VoiceNotice } from "@/shared/ui";
import { useT } from "@/shared/i18n";

export function BuilderPage() {
  const t = useT();
  return (
    <>
      <h1 className="sr-only">{t.routes.builder.title}</h1>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <VoiceNotice />
        <ClassLegend className="ml-auto" />
      </div>
      <SyllableBuilder />
    </>
  );
}
