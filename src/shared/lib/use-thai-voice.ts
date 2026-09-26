"use client";
import { useEffect, useState } from "react";
import { getThaiVoice } from "./speech";

export type VoiceStatus = "checking" | "ready" | "missing" | "unsupported";

export function useThaiVoice(): VoiceStatus {
  const [status, setStatus] = useState<VoiceStatus>("checking");
  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      setStatus("unsupported");
      return;
    }
    const check = () => setStatus(getThaiVoice() ? "ready" : "missing");
    check();
    window.speechSynthesis.addEventListener("voiceschanged", check);
    const t = setTimeout(check, 1200);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", check);
      clearTimeout(t);
    };
  }, []);
  return status;
}
