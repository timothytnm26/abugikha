import { describe, expect, it } from "vitest";
import { SKINS } from "./skins";
import { PALETTE_KEYS } from "./palette";
import { AA_CONTRAST as AA, contrastRatio as contrast, mixHex as mix } from "../lib/color";

describe.each(SKINS)("skin $id", ({ vars }) => {
  it("chữ chính và chữ phụ đọc được trên giấy, giấy đậm và tờ ghi chú", () => {
    for (const bg of ["paper", "paper-deep", "sheet"] as const) {
      expect(contrast(vars.ink, vars[bg]), `ink / ${bg}`).toBeGreaterThanOrEqual(AA);
      expect(contrast(vars["ink-soft"], vars[bg]), `ink-soft / ${bg}`).toBeGreaterThanOrEqual(AA);
    }
  });

  it("mọi màu ý nghĩa là nền sáng: chữ on-accent đọc được trên nó, và biến thể -ink (pha 35% với mực) đọc được trên giấy và tờ ghi chú", () => {
    for (const k of PALETTE_KEYS) {
      expect(contrast(vars["on-accent"], vars[k]), `on-accent / ${k}`).toBeGreaterThanOrEqual(AA);
      const ink = mix(vars[k], vars.ink, 0.35);
      expect(contrast(ink, vars.paper), `${k}-ink / paper`).toBeGreaterThanOrEqual(AA);
      expect(contrast(ink, vars.sheet), `${k}-ink / sheet`).toBeGreaterThanOrEqual(AA);
    }
  });

  it("màu nhấn thương hiệu, màu loại bỏ đọc được trên giấy và tờ ghi chú", () => {
    for (const k of ["brand", "removed"] as const) {
      expect(contrast(vars[k], vars.paper), `${k} / paper`).toBeGreaterThanOrEqual(AA);
      expect(contrast(vars[k], vars.sheet), `${k} / sheet`).toBeGreaterThanOrEqual(AA);
    }
  });

  it("chữ onTint đủ tương phản trên nền tint 16% của chính màu", () => {
    for (const k of PALETTE_KEYS) {
      const text = mix(vars[k], vars.ink, 0.35);
      expect(contrast(text, mix(vars[k], vars.paper, 0.16)), `${k} trên tint`).toBeGreaterThanOrEqual(AA);
    }
  });
});
