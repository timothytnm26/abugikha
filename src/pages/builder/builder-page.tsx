"use client";
import { SyllableBuilder } from "@/widgets/syllable-builder";
import { VoiceNotice } from "@/shared/ui";

export function BuilderPage() {
  return (
    <>
      <div className="mb-3">
        <VoiceNotice />
      </div>
      <SyllableBuilder />
    </>
  );
}
