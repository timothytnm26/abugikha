import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { DEFAULT_PALETTE, SURFACE_COLORS } from "@abugikha/core";
import { describe, expect, it } from "vitest";
import { DEFAULT_SKIN, SKIN_BY_ID } from "./skins";

const css = readFileSync(fileURLToPath(new URL("../../app/styles/globals.css", import.meta.url)), "utf8");
/** Lấy `--color-<tên>: #hex` trong một khối CSS bắt đầu bằng `marker` */
const varsIn = (marker: string) => {
  const start = css.indexOf(marker);
  expect(start, marker).toBeGreaterThanOrEqual(0);
  // Cắt đúng khối `{ … }` bằng cách đếm ngoặc
  let depth = 0;
  let end = start;
  for (let i = css.indexOf("{", start); i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}" && --depth === 0) {
      end = i;
      break;
    }
  }
  const block = css.slice(start, end);
  return Object.fromEntries([...block.matchAll(/--color-([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2].toLowerCase()]));
};

// skins.ts là nguồn chính; globals.css (mặc định trước khi script khởi động chạy) và packages/core (bảng màu mobile) lặp lại skin mặc định,
// nên test này báo ngay khi chúng lệch nhau.
describe("globals.css", () => {
  it(`khớp skin ${DEFAULT_SKIN} trong skins.ts`, () => {
    const vars = varsIn("@theme static {");
    const skin = SKIN_BY_ID.get(DEFAULT_SKIN)!;
    for (const [key, value] of Object.entries(skin.vars)) expect(vars[key], key).toBe(value.toLowerCase());
  });
});

describe("packages/core", () => {
  it("bảng màu mặc định (mobile, nền sáng) khớp skin mặc định", () => {
    const skin = SKIN_BY_ID.get(DEFAULT_SKIN)!;
    for (const [key, value] of Object.entries(DEFAULT_PALETTE.light)) expect(skin.vars[key as keyof typeof skin.vars], key).toBe(value);
    const s = SURFACE_COLORS.light;
    expect({ paper: s.paper, "paper-deep": s.paperDeep, ink: s.ink, "ink-soft": s.inkSoft, "on-accent": s.onAccent }).toEqual({
      paper: skin.vars.paper,
      "paper-deep": skin.vars["paper-deep"],
      ink: skin.vars.ink,
      "ink-soft": skin.vars["ink-soft"],
      "on-accent": skin.vars["on-accent"],
    });
  });
});
