"use client";
import { ScriptTimeline } from "@/widgets/script-timeline";
import { HISTORIC_FONTS_CSS } from "@/shared/config/fonts";

export function HistoryPage() {
  return (
    <>
      {/* React 19 đưa stylesheet lên <head> */}
      <link rel="stylesheet" href={HISTORIC_FONTS_CSS} precedence="default" />
      <ScriptTimeline />
    </>
  );
}
