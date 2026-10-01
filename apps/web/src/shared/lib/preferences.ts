"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { PALETTE_KEYS, PAPER_STYLES, PREFS_STORAGE_KEY, type PaletteKey, type PaperStyle, type SkinVarKey } from "../config/palette";
import { DEFAULT_SKIN, SKIN_BY_ID, isSkinEnabled, type SkinId } from "../config/skins";

interface Preferences {
  /** Hiện IPA/RTGS trên các ô chọn */
  showPhonetic: boolean;
  /** Tự đọc âm tiết mỗi khi chọn một mảnh ghép */
  autoSpeak: boolean;
  /** Skin đã chọn (màu + kiểu dáng) */
  skinId: SkinId;
  /** Màu người dùng đã đổi, riêng cho từng skin */
  palette: Partial<Record<SkinId, Partial<Record<PaletteKey, string>>>>;
  paper: PaperStyle;
  /** Đã đóng khung gợi ý cách ghép âm tiết ở trang /lab */
  coachDismissed: boolean;
  setShowPhonetic: (v: boolean) => void;
  setAutoSpeak: (v: boolean) => void;
  setSkin: (id: SkinId) => void;
  setColor: (skin: SkinId, key: PaletteKey, value: string) => void;
  resetPalette: (skin: SkinId) => void;
  setPaper: (p: PaperStyle) => void;
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
      coachDismissed: false,
      setShowPhonetic: (showPhonetic) => set({ showPhonetic }),
      setAutoSpeak: (autoSpeak) => set({ autoSpeak }),
      setSkin: (skinId) => set({ skinId }),
      setColor: (skin, key, value) => set((s) => ({ palette: { ...s.palette, [skin]: { ...s.palette[skin], [key]: value } } })),
      resetPalette: (skin) => set((s) => ({ palette: { ...s.palette, [skin]: {} } })),
      setPaper: (paper) => set({ paper }),
      setCoachDismissed: (coachDismissed) => set({ coachDismissed }),
    }),
    {
      name: PREFS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ showPhonetic, autoSpeak, skinId, palette, paper, coachDismissed }) => ({ showPhonetic, autoSpeak, skinId, palette, paper, coachDismissed }),
      // Nạp sau khi mount để HTML server và client khớp nhau
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<Preferences>;
        return {
          ...current,
          ...p,
          skinId: isSkinEnabled(p.skinId) ? p.skinId : DEFAULT_SKIN,
          paper: p.paper && PAPER_STYLES.includes(p.paper) ? p.paper : "tiers",
        };
      },
      skipHydration: true,
    },
  ),
);

/** Ghi skin + màu tuỳ chỉnh lên <html>: data-skin chọn kiểu dáng trong CSS, các --color-* là màu của skin hoặc màu người dùng đã đổi. */
export function applyAppearance(skinId: SkinId, overrides: Partial<Record<PaletteKey, string>> = {}, paper: PaperStyle) {
  const root = document.documentElement;
  root.dataset.paper = paper;
  root.dataset.skin = skinId;
  const vars = SKIN_BY_ID.get(skinId)!.vars;
  for (const k of Object.keys(vars) as SkinVarKey[]) {
    const custom = (PALETTE_KEYS as readonly string[]).includes(k) ? overrides[k as PaletteKey] : undefined;
    root.style.setProperty(`--color-${k}`, custom ?? vars[k]);
  }
}
