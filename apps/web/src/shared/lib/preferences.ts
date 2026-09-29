"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { PaletteKey } from "../config/palette";
import { PREFS_STORAGE_KEY } from "../config/palette";
import type { Theme } from "./theme";

interface Preferences {
  /** Hiện IPA/RTGS trên các ô chọn */
  showPhonetic: boolean;
  /** Tự đọc âm tiết mỗi khi chọn một mảnh ghép */
  autoSpeak: boolean;
  /** Màu người dùng đã đổi, riêng cho từng theme */
  palette: Record<Theme, Partial<Record<PaletteKey, string>>>;
  setShowPhonetic: (v: boolean) => void;
  setAutoSpeak: (v: boolean) => void;
  setColor: (theme: Theme, key: PaletteKey, value: string) => void;
  resetPalette: (theme: Theme) => void;
}

export const usePreferences = create<Preferences>()(
  persist(
    (set) => ({
      showPhonetic: true,
      autoSpeak: true,
      palette: { light: {}, dark: {} },
      setShowPhonetic: (showPhonetic) => set({ showPhonetic }),
      setAutoSpeak: (autoSpeak) => set({ autoSpeak }),
      setColor: (theme, key, value) => set((s) => ({ palette: { ...s.palette, [theme]: { ...s.palette[theme], [key]: value } } })),
      resetPalette: (theme) => set((s) => ({ palette: { ...s.palette, [theme]: {} } })),
    }),
    {
      name: PREFS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ showPhonetic, autoSpeak, palette }) => ({ showPhonetic, autoSpeak, palette }),
      // Nạp sau khi mount để HTML server và client khớp nhau
      skipHydration: true,
    },
  ),
);

export function applyPalette(overrides: Partial<Record<PaletteKey, string>>, all: readonly PaletteKey[]) {
  const root = document.documentElement.style;
  for (const k of all) {
    const v = overrides[k];
    if (v) root.setProperty(`--color-${k}`, v);
    else root.removeProperty(`--color-${k}`);
  }
}

