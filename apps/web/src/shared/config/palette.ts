import { CLASS_KEYS, TONE_KEYS, type PaletteKey as CorePaletteKey } from "@abugikha/core";

export { CLASS_KEYS, TONE_KEYS, PALETTE_KEYS as CORE_PALETTE_KEYS, DEFAULT_PALETTE, type PaletteKey as CorePaletteKey } from "@abugikha/core";

/** Màu vai trò của nguyên âm và phụ âm cuối (đã dùng ở phần nguyên âm biến hình, nay tô cả âm tiết). */
export const PART_KEYS = ["part-vowel", "part-final"] as const;
/** Mọi màu người dùng chỉnh được ở web: nhóm phụ âm, nguyên âm, âm cuối, dấu thanh theo thanh. */
export const PALETTE_KEYS = [...CLASS_KEYS, ...PART_KEYS, ...TONE_KEYS] as const;
export type PaletteKey = CorePaletteKey | (typeof PART_KEYS)[number];

/** Màu nền, chữ và giấy: do giao diện quyết định, người dùng không chỉnh từng màu. */
export const SURFACE_KEYS = ["paper", "paper-deep", "ink", "ink-soft", "on-accent", "sheet", "sheet-line", "margin"] as const;
export type SurfaceKey = (typeof SURFACE_KEYS)[number];
export type ThemeVarKey = PaletteKey | SurfaceKey;

/** "tiers" = vở 4 tầng (mặc định); các kiểu còn lại thay các tầng bằng nền giấy kẻ. */
export const PAPER_STYLES = ["tiers", "lines", "grid", "dots", "plain"] as const;
export type PaperStyle = (typeof PAPER_STYLES)[number];

/** Màu CSS của một khoá palette; là CSS var nên tự đổi theo theme sáng/tối và màu người dùng chọn. */
export const paletteVar = (key: PaletteKey) => `var(--color-${key})`;

export const PREFS_STORAGE_KEY = "narakthai-prefs";
