/**
 * Các màu của từng phần trong âm tiết mà người dùng tuỳ chỉnh được.
 * Tên = hậu tố của CSS var --color-<key>.
 */
export const CLASS_KEYS = ["mid", "high", "low"] as const;
export const PART_KEYS = ["vowel", "final"] as const;
export const TONE_KEYS = [
  "tone-mid",
  "tone-low",
  "tone-falling",
  "tone-high",
  "tone-rising",
] as const;
export const PALETTE_KEYS = [...CLASS_KEYS, ...PART_KEYS, ...TONE_KEYS] as const;
export type PaletteKey = (typeof PALETTE_KEYS)[number];

/** Màu nền, chữ và giấy: chỉ do giao diện quyết định, người dùng không chỉnh từng màu. */
export const SURFACE_KEYS = [
  "paper",
  "paper-deep",
  "ink",
  "ink-soft",
  "on-accent",
  "sheet",
  "sheet-line",
] as const;
export type SurfaceKey = (typeof SURFACE_KEYS)[number];
export type ThemeVarKey = PaletteKey | SurfaceKey;

export const PAPER_STYLES = ["lines", "grid", "dots", "plain"] as const;
export type PaperStyle = (typeof PAPER_STYLES)[number];

export const PREFS_STORAGE_KEY = "narakthai-prefs";
