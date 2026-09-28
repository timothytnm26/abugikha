"use client";
import { useEffect } from "react";
import { CLASS_KEYS, TONE_KEYS } from "@/shared/config/palette";
import { applyPalette, usePreferences } from "@/shared/lib/preferences";
import { useEffectiveTheme } from "@/shared/lib/theme";

const ALL = [...CLASS_KEYS, ...TONE_KEYS];

/** Nạp tuỳ chỉnh đã lưu và giữ CSS var khớp với theme đang dùng. */
export function PreferencesSync() {
  const theme = useEffectiveTheme();
  const palette = usePreferences((s) => s.palette);
  useEffect(() => {
    usePreferences.persist.rehydrate();
  }, []);
  useEffect(() => {
    if (theme) applyPalette(palette[theme], ALL);
  }, [theme, palette]);
  return null;
}
