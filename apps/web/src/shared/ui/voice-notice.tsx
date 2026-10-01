"use client";
import { useThaiVoice } from "../lib/use-thai-voice";
import { useT } from "../i18n";

export function VoiceNotice() {
  const status = useThaiVoice();
  const t = useT();
  if (status === "ready" || status === "checking") return null;
  return (
    <p role="status" className="border border-high/30 bg-high/5 px-3 py-1.5 text-xs text-ink">
      {status === "unsupported" ? t.voice.unsupported : t.voice.missing}
    </p>
  );
}
