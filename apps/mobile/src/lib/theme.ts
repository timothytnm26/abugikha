import { useColorScheme } from "react-native";
import { DEFAULT_PALETTE, SURFACE_COLORS, toneKey, type PaletteKey, type Theme } from "@abugikha/core";
import type { Tone } from "@abugikha/core/syllable";

export interface Colors {
  paper: string;
  paperDeep: string;
  ink: string;
  inkSoft: string;
  onAccent: string;
  accent: (key: PaletteKey) => string;
  tone: (tone: Tone) => string;
}

/** Bảng màu theo chế độ sáng/tối của hệ thống, cùng giá trị với web. */
export function useColors(): Colors & { theme: Theme } {
  const theme: Theme = useColorScheme() === "dark" ? "dark" : "light";
  const palette = DEFAULT_PALETTE[theme];
  return {
    theme,
    ...SURFACE_COLORS[theme],
    accent: (key) => palette[key],
    tone: (t) => palette[toneKey(t)],
  };
}
