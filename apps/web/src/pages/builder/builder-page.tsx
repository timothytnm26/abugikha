"use client";
import { SyllableBuilder } from "@/widgets/syllable-builder";
import { VoiceNotice } from "@/shared/ui";
import { useT } from "@/shared/i18n";

export function BuilderPage() {
  const t = useT();
  return (
    <>
      <h1 className="sr-only">{t.routes.builder.title}</h1>
      <div className="mb-3">
        <VoiceNotice />
      </div>
      <SyllableBuilder />
    </>
  );
}
