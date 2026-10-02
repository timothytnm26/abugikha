"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { PALETTE_KEYS, PAPER_STYLES, PREFS_STORAGE_KEY, type PaletteKey, type PaperStyle, type SkinVarKey } from "../config/palette";
import { DEFAULT_SKIN, SKIN_BY_ID, SKINS, DARK_SURFACE, isSkinEnabled, type PaletteScope, type SkinId, type ThemeMode } from "../config/skins";

interface Preferences {
  /** Hiện IPA/RTGS trên các ô chọn */
  showPhonetic: boolean;
  /** Tự đọc âm tiết mỗi khi chọn một mảnh ghép */
  autoSpeak: boolean;
  /** Skin đã chọn (màu + kiểu dáng); null = chưa chọn, dùng giao diện mặc định ở globals.css */
  skinId: SkinId | null;
  /** Màu người dùng đã đổi, riêng cho từng skin (khoá "base" khi chưa chọn skin) */
  palette: Partial<Record<PaletteScope, Partial<Record<PaletteKey, string>>>>;
  paper: PaperStyle;
  /** Giao diện sáng hoặc tối, độc lập với skin */
  theme: ThemeMode;
  /** Đã đóng khung gợi ý cách ghép âm tiết ở trang /lab */
  coachDismissed: boolean;
  setShowPhonetic: (v: boolean) => void;
  setAutoSpeak: (v: boolean) => void;
  setSkin: (id: SkinId | null) => void;
  setColor: (skin: PaletteScope, key: PaletteKey, value: string) => void;
  resetPalette: (skin: PaletteScope) => void;
  setPaper: (p: PaperStyle) => void;
  setTheme: (t: ThemeMode) => void;
  setCoachDismissed: (v: boolean) => void;
}

export const usePreferences = create<Preferences>()(
  persist(
    (set) => ({
      showPhonetic: true,
      autoSpeak: true,
      skinId: DEFAULT_SKIN,
      palette: {},
      paper: "tiers",
      theme: "light",
      coachDismissed: false,
      setShowPhonetic: (showPhonetic) => set({ showPhonetic }),
      setAutoSpeak: (autoSpeak) => set({ autoSpeak }),
      setSkin: (skinId) => set({ skinId }),
      setColor: (skin, key, value) => set((s) => ({ palette: { ...s.palette, [skin]: { ...s.palette[skin], [key]: value } } })),
      resetPalette: (skin) => set((s) => ({ palette: { ...s.palette, [skin]: {} } })),
      setPaper: (paper) => set({ paper }),
      setTheme: (theme) => set({ theme }),
      setCoachDismissed: (coachDismissed) => set({ coachDismissed }),
    }),
    {
      name: PREFS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ showPhonetic, autoSpeak, skinId, palette, paper, theme, coachDismissed }) => ({ showPhonetic, autoSpeak, skinId, palette, paper, theme, coachDismissed }),
      // Nạp sau khi mount để HTML server và client khớp nhau
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<Preferences>;
        return {
          ...current,
          ...p,
          skinId: isSkinEnabled(p.skinId) ? p.skinId : DEFAULT_SKIN,
          theme: p.theme === "dark" ? "dark" : "light",
          paper: p.paper && PAPER_STYLES.includes(p.paper) ? p.paper : "tiers",
        };
      },
      skipHydration: true,
    },
  ),
);

/** Ghi skin + màu tuỳ chỉnh + sáng/tối lên <html>: data-skin chọn kiểu dáng trong CSS, các --color-* là màu của skin hoặc màu người dùng đã đổi. Chưa chọn skin thì bỏ data-skin và chỉ giữ màu người dùng đã đổi. */
export function applyAppearance(skinId: SkinId | null, overrides: Partial<Record<PaletteKey, string>> = {}, paper: PaperStyle, theme: ThemeMode = "light") {
  const root = document.documentElement;
  root.dataset.paper = paper;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  if (skinId) root.dataset.skin = skinId;
  else delete root.dataset.skin;
  // Xoá màu của lần áp trước (kể cả của skin khác) để màu mặc định ở globals.css lộ ra lại
  for (const k of new Set(SKINS.flatMap((s) => Object.keys(s.vars)))) root.style.removeProperty(`--color-${k}`);
  if (skinId) {
    const vars = SKIN_BY_ID.get(skinId)!.vars;
    for (const k of Object.keys(vars) as SkinVarKey[]) root.style.setProperty(`--color-${k}`, vars[k]);
  }
  for (const k of PALETTE_KEYS) if (overrides[k]) root.style.setProperty(`--color-${k}`, overrides[k]);
  if (theme === "dark") for (const [k, v] of Object.entries(DARK_SURFACE)) root.style.setProperty(`--color-${k}`, v);
}
