import type { ConsonantClass } from "./consonant/types";
import type { Tone } from "./syllable/tone";

export type Theme = "light" | "dark";

/** Các màu người dùng tuỳ chỉnh được: 3 lớp phụ âm + 5 thanh. Web dùng làm hậu tố CSS var --color-<key>. */
export const CLASS_KEYS = ["mid", "high", "low"] as const satisfies readonly ConsonantClass[];
export const TONE_KEYS = [
  "tone-mid",
  "tone-low",
  "tone-falling",
  "tone-high",
  "tone-rising",
] as const satisfies readonly `tone-${Tone}`[];
export type PaletteKey = (typeof CLASS_KEYS)[number] | (typeof TONE_KEYS)[number];
export const PALETTE_KEYS = [...CLASS_KEYS, ...TONE_KEYS] as const;

export const toneKey = (tone: Tone): PaletteKey => `tone-${tone}`;

/** Bảng màu mặc định (web: trùng với globals.css) */
export const DEFAULT_PALETTE: Record<Theme, Record<PaletteKey, string>> = {
  light: {
    mid: "#7bc67e",
    high: "#ffa552",
    low: "#2ab7ca",
    "tone-mid": "#8a94a6",
    "tone-low": "#8e7df0",
    "tone-falling": "#ff8fa3",
    "tone-high": "#fed766",
    "tone-rising": "#2ab7ca",
  },
  dark: {
    mid: "#56d0af",
    high: "#fd9884",
    low: "#7cb4fc",
    "tone-mid": "#b4c1be",
    "tone-low": "#9ba4ee",
    "tone-falling": "#fd9bc2",
    "tone-high": "#f8c065",
    "tone-rising": "#67d8fc",
  },
};

/** Màu nền/chữ cơ bản (web: trùng với globals.css) */
export const SURFACE_COLORS: Record<Theme, { paper: string; paperDeep: string; ink: string; inkSoft: string; onAccent: string }> = {
  light: { paper: "#f4f4f8", paperDeep: "#e6e6ea", ink: "#24304a", inkSoft: "#5b6478", onAccent: "#141a2b" },
  dark: { paper: "#121a1d", paperDeep: "#1b262a", ink: "#e3ebe6", inkSoft: "#9aaaa2", onAccent: "#0f1518" },
};
