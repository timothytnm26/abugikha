import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { DEFAULT_PALETTE, SURFACE_COLORS } from "@abugikha/core";
import { describe, expect, it } from "vitest";
import { DEFAULT_THEME, THEME_BY_ID } from "./themes";

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

// themes.ts là nguồn chính; globals.css (mặc định trước khi script khởi động chạy) và packages/core lặp lại hai giao diện mặc định,
// nên test này báo ngay khi chúng lệch nhau.
describe.each([
  ["light", "@theme static {", DEFAULT_THEME.light],
  ["dark", '[data-theme="dark"] {', DEFAULT_THEME.dark],
  ["dark (prefers-color-scheme)", ':root:not([data-theme="light"]) {', DEFAULT_THEME.dark],
] as const)("globals.css %s", (_name, marker, themeId) => {
  it(`khớp giao diện ${themeId} trong themes.ts`, () => {
    const css = varsIn(marker);
    const theme = THEME_BY_ID.get(themeId)!;
    for (const [key, value] of Object.entries(theme.vars)) {
      if (key in css) expect(css[key], key).toBe(value.toLowerCase());
    }
    expect(Object.keys(css).length).toBeGreaterThan(10);
  });
});

describe("packages/core", () => {
  it.each(["light", "dark"] as const)("bảng màu mặc định %s khớp themes.ts", (mode) => {
    const theme = THEME_BY_ID.get(DEFAULT_THEME[mode])!;
    for (const [key, value] of Object.entries(DEFAULT_PALETTE[mode])) expect(theme.vars[key as keyof typeof theme.vars], key).toBe(value);
    const s = SURFACE_COLORS[mode];
    expect({ paper: s.paper, "paper-deep": s.paperDeep, ink: s.ink, "ink-soft": s.inkSoft, "on-accent": s.onAccent }).toEqual({
      paper: theme.vars.paper,
      "paper-deep": theme.vars["paper-deep"],
      ink: theme.vars.ink,
      "ink-soft": theme.vars["ink-soft"],
      "on-accent": theme.vars["on-accent"],
    });
  });
});
