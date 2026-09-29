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
    mid: "#2f7d6d",
    high: "#b8452e",
    low: "#3558a8",
    "tone-mid": "#6f7f75",
    "tone-low": "#4b3f8f",
    "tone-falling": "#b03a78",
    "tone-high": "#b87908",
    "tone-rising": "#15849a",
  },
  dark: {
    mid: "#5fc0a8",
    high: "#ef8a70",
    low: "#8aa8f0",
    "tone-mid": "#a5b5ab",
    "tone-low": "#aa9ff0",
    "tone-falling": "#ec7fb9",
    "tone-high": "#f0bb55",
    "tone-rising": "#5ccbde",
  },
};

/** Màu nền/chữ cơ bản (web: trùng với globals.css) */
export const SURFACE_COLORS: Record<Theme, { paper: string; paperDeep: string; ink: string; inkSoft: string; onAccent: string }> = {
  light: { paper: "#eef1ec", paperDeep: "#e1e8e1", ink: "#1e2833", inkSoft: "#5a6672", onAccent: "#ffffff" },
  dark: { paper: "#121a1d", paperDeep: "#1b262a", ink: "#e3ebe6", inkSoft: "#9aaaa2", onAccent: "#0f1518" },
};
