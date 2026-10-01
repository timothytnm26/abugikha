import { describe, expect, it } from "vitest";
import { THEMES } from "./themes";
import { PALETTE_KEYS } from "./palette";
import { AA_CONTRAST as AA, contrastRatio as contrast, mixHex as mix } from "../lib/color";

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
