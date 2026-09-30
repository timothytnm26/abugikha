"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { PALETTE_KEYS, PAPER_STYLES, PREFS_STORAGE_KEY, type PaletteKey, type PaperStyle, type ThemeVarKey } from "../config/palette";
import { DEFAULT_THEME, THEME_BY_ID, type ThemeId, type ThemeMode } from "../config/themes";

interface Preferences {
  /** Hiện IPA/RTGS trên các ô chọn */
  showPhonetic: boolean;
  /** Giao diện đã chọn; null = theo chế độ sáng/tối của hệ thống */
  themeId: ThemeId | null;
  /** Giao diện sáng và tối gần nhất được dùng, để nút sáng/tối quay lại đúng giao diện */
  lastLight: ThemeId;
  lastDark: ThemeId;
  /** Màu người dùng đã đổi, riêng cho từng giao diện */
  palette: Partial<Record<ThemeId, Partial<Record<PaletteKey, string>>>>;
  paper: PaperStyle;
  setShowPhonetic: (v: boolean) => void;
  setTheme: (id: ThemeId) => void;
  setColor: (theme: ThemeId, key: PaletteKey, value: string) => void;
  resetPalette: (theme: ThemeId) => void;
  setPaper: (p: PaperStyle) => void;
}

export const usePreferences = create<Preferences>()(
  persist(
    (set) => ({
      showPhonetic: true,
      themeId: null,
      lastLight: DEFAULT_THEME.light,
      lastDark: DEFAULT_THEME.dark,
      palette: {},
      paper: "lines",
      setShowPhonetic: (showPhonetic) => set({ showPhonetic }),
      setTheme: (id) =>
        set(THEME_BY_ID.get(id)!.mode === "light" ? { themeId: id, lastLight: id } : { themeId: id, lastDark: id }),
      setColor: (theme, key, value) => set((s) => ({ palette: { ...s.palette, [theme]: { ...s.palette[theme], [key]: value } } })),
      resetPalette: (theme) => set((s) => ({ palette: { ...s.palette, [theme]: {} } })),
      setPaper: (paper) => set({ paper }),
    }),
    {
      name: PREFS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ showPhonetic, themeId, lastLight, lastDark, palette, paper }) => ({ showPhonetic, themeId, lastLight, lastDark, palette, paper }),
      // Nạp sau khi mount để HTML server và client khớp nhau
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<Preferences>;
        return {
          ...current,
          ...p,
          themeId: p.themeId && THEME_BY_ID.has(p.themeId) ? p.themeId : null,
          paper: p.paper && PAPER_STYLES.includes(p.paper) ? p.paper : "lines",
        };
      },
      skipHydration: true,
    },
  ),
);

const SURFACE_AND_PARTS = (id: ThemeId) => Object.keys(THEME_BY_ID.get(id)!.vars) as ThemeVarKey[];

/** Ghi giao diện + màu tuỳ chỉnh lên <html>; themeId = null thì trả về mặc định trong CSS. */
export function applyAppearance(themeId: ThemeId | null, overrides: Partial<Record<PaletteKey, string>> = {}, paper: PaperStyle) {
  const root = document.documentElement;
  root.dataset.paper = paper;
  if (!themeId) {
    for (const k of [...SURFACE_AND_PARTS("celadon")]) root.style.removeProperty(`--color-${k}`);
    root.dataset.theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    return;
  }
  const theme = THEME_BY_ID.get(themeId)!;
  root.dataset.theme = theme.mode;
  for (const k of SURFACE_AND_PARTS(themeId)) {
    const custom = (PALETTE_KEYS as readonly string[]).includes(k) ? overrides[k as PaletteKey] : undefined;
    root.style.setProperty(`--color-${k}`, custom ?? theme.vars[k]);
  }
}

export type { ThemeMode };
