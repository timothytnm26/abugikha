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
    mid: "#12bd0c",
    high: "#ff5200",
    low: "#1e9fe8",
    "tone-mid": "#c9cdc9",
    "tone-low": "#b07aff",
    "tone-falling": "#f47b6b",
    "tone-high": "#ffe100",
    "tone-rising": "#1e9fe8",
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
  light: { paper: "#f4efe9", paperDeep: "#e9e1d7", ink: "#1b1a17", inkSoft: "#5e5750", onAccent: "#14130f" },
  dark: { paper: "#121a1d", paperDeep: "#1b262a", ink: "#e3ebe6", inkSoft: "#9aaaa2", onAccent: "#0f1518" },
};
