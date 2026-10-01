import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { AA_CONTRAST, contrastRatio } from "../lib/color";

const css = readFileSync(fileURLToPath(new URL("../../app/styles/globals.css", import.meta.url)), "utf8");
const poster = Object.fromEntries([...css.matchAll(/--color-poster-(\w+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2].toLowerCase()]));
const color = (name: string) => (name === "white" ? "#ffffff" : poster[name]);

/** Cặp chữ trên nền đang dùng ở shared/ui/poster-tile.tsx (TILE) cùng các cặp phụ: dải màu, chữ phụ và viền đậm. */
const PAIRS: [text: string, bg: string][] = [
  ["white", "blue"],
  ["cream", "blue"],
  ["black", "orange"],
  ["orange", "black"],
  ["cream", "black"],
  ["black", "cream"],
  ["blue", "cream"],
];

describe("bảng màu áp phích", () => {
  it("đủ năm màu", () => {
    expect(Object.keys(poster).sort()).toEqual(["black", "blue", "cream", "orange", "taupe"]);
  });

  it("xám kem đủ 3:1 cho chữ lớn trên nền kem", () => {
    expect(contrastRatio(color("taupe"), color("cream"))).toBeGreaterThanOrEqual(3);
  });

  it.each(PAIRS)("chữ %s trên nền %s đạt AA", (text, bg) => {
    expect(contrastRatio(color(text), color(bg))).toBeGreaterThanOrEqual(AA_CONTRAST);
  });
});
