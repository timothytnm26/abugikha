import { describe, expect, it } from "vitest";
import { THEMES } from "./themes";
import { PALETTE_KEYS } from "./palette";

const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const luminance = (hex: string) => {
  const [r, g, b] = channels(hex).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
/** Trộn `fg` lên `bg` với độ đậm `alpha` (xấp xỉ trong sRGB) */
const mix = (fg: string, bg: string, alpha: number) =>
  "#" +
  channels(fg)
    .map((v, i) => Math.round(v * alpha + channels(bg)[i] * (1 - alpha)).toString(16).padStart(2, "0"))
    .join("");

const AA = 4.5;

describe.each(THEMES)("giao diện $id", ({ vars }) => {
  it("chữ chính và chữ phụ đọc được trên giấy, giấy đậm và tờ ghi chú", () => {
    for (const bg of ["paper", "paper-deep", "sheet"] as const) {
      expect(contrast(vars.ink, vars[bg]), `ink / ${bg}`).toBeGreaterThanOrEqual(AA);
      expect(contrast(vars["ink-soft"], vars[bg]), `ink-soft / ${bg}`).toBeGreaterThanOrEqual(AA);
    }
  });

  it("mọi màu ý nghĩa đọc được trên giấy và tờ ghi chú, và chữ trên nền màu đó đọc được", () => {
    for (const k of PALETTE_KEYS) {
      expect(contrast(vars[k], vars.paper), `${k} / paper`).toBeGreaterThanOrEqual(AA);
      expect(contrast(vars[k], vars.sheet), `${k} / sheet`).toBeGreaterThanOrEqual(AA);
      expect(contrast(vars["on-accent"], vars[k]), `on-accent / ${k}`).toBeGreaterThanOrEqual(AA);
    }
  });

  it("chữ onTint đủ tương phản trên nền tint 16% của chính màu", () => {
    for (const k of PALETTE_KEYS) {
      const text = mix(vars[k], vars.ink, 0.65);
      expect(contrast(text, mix(vars[k], vars.paper, 0.16)), `${k} trên tint`).toBeGreaterThanOrEqual(AA);
    }
  });
});
