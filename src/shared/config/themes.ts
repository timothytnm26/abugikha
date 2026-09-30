import type { L10n } from "../i18n/types";
import { PREFS_STORAGE_KEY, type PaletteKey, type SurfaceKey, type ThemeVarKey } from "./palette";

export type ThemeMode = "light" | "dark";
export type ThemeId =
  | "celadon"
  | "sakura"
  | "matcha"
  | "sepia"
  | "midnight"
  | "twilight"
  | "cocoa";

export interface ThemeDef {
  id: ThemeId;
  mode: ThemeMode;
  name: L10n;
  vars: Record<ThemeVarKey, string>;
}

/** Màu các phần âm tiết: bản sáng dịu và bản tối dịu, dùng chung cho mọi giao diện cùng chế độ. */
const LIGHT_PARTS: Record<PaletteKey, string> = {
  mid: "#2f7d6d",
  high: "#b8452e",
  low: "#3558a8",
  vowel: "#9a5b1a",
  final: "#6b7a1f",
  "tone-mid": "#6f7f75",
  "tone-low": "#4b3f8f",
  "tone-falling": "#b03a78",
  "tone-high": "#b87908",
  "tone-rising": "#15849a",
};
const DARK_PARTS: Record<PaletteKey, string> = {
  mid: "#5fc0a8",
  high: "#ef8a70",
  low: "#8aa8f0",
  vowel: "#e0a56a",
  final: "#b6c765",
  "tone-mid": "#a5b5ab",
  "tone-low": "#aa9ff0",
  "tone-falling": "#ec7fb9",
  "tone-high": "#f0bb55",
  "tone-rising": "#5ccbde",
};

const make = (
  id: ThemeId,
  mode: ThemeMode,
  name: L10n,
  surface: Record<SurfaceKey, string>,
  parts: Partial<Record<PaletteKey, string>> = {},
): ThemeDef => ({
  id,
  mode,
  name,
  vars: { ...(mode === "light" ? LIGHT_PARTS : DARK_PARTS), ...parts, ...surface },
});

/**
 * Bảng giao diện có sẵn. Nền luôn ngả xám/kem thay vì trắng hoặc đen tuyền, độ tương phản chữ vẫn
 * đủ đọc nhưng không chói, để học lâu không mỏi mắt.
 */
export const THEMES: ThemeDef[] = [
  make("celadon", "light", { vi: "Men ngọc", en: "Celadon" }, {
    paper: "#eef1ec", "paper-deep": "#e1e8e1", ink: "#1e2833", "ink-soft": "#5a6672", "on-accent": "#ffffff",
    sheet: "#fbfbf4", "sheet-line": "#b9c9c9",
  }),
  make("sakura", "light", { vi: "Sữa hoa đào", en: "Sakura milk" }, {
    paper: "#f6eeeb", "paper-deep": "#eddfdb", ink: "#3a2c32", "ink-soft": "#7a6870", "on-accent": "#ffffff",
    sheet: "#fffaf6", "sheet-line": "#e3c4c4",
  }, { mid: "#3a8574", high: "#bd4a3c", low: "#4a62ae", vowel: "#8f5a1c" }),
  make("matcha", "light", { vi: "Trà xanh", en: "Matcha" }, {
    paper: "#ecefe1", "paper-deep": "#dfe5d0", ink: "#262f1f", "ink-soft": "#626c55", "on-accent": "#ffffff",
    sheet: "#f9faee", "sheet-line": "#c2cfa8",
  }, { mid: "#2c7a5c", low: "#3b5ea3", final: "#5e6d1a" }),
  make("sepia", "light", { vi: "Giấy nâu", en: "Sepia paper" }, {
    paper: "#f0e8d6", "paper-deep": "#e5dbc3", ink: "#3b3226", "ink-soft": "#786c59", "on-accent": "#fffdf7",
    sheet: "#fbf4e2", "sheet-line": "#d6c7a2",
  }, { mid: "#3a7566", high: "#ad4630", low: "#3d5a9c", vowel: "#8a4f14", final: "#647019" }),
  make("midnight", "dark", { vi: "Đêm ngọc", en: "Midnight celadon" }, {
    paper: "#121a1d", "paper-deep": "#1b262a", ink: "#e3ebe6", "ink-soft": "#9aaaa2", "on-accent": "#0f1518",
    sheet: "#1f2b2f", "sheet-line": "#3a4c52",
  }),
  make("twilight", "dark", { vi: "Hoàng hôn tím", en: "Twilight" }, {
    paper: "#1a1929", "paper-deep": "#252438", ink: "#e6e3f0", "ink-soft": "#a5a2bc", "on-accent": "#14131f",
    sheet: "#2a2940", "sheet-line": "#45435f",
  }, { mid: "#66c4ae", high: "#f08c78", low: "#93aaf2" }),
  make("cocoa", "dark", { vi: "Ca cao", en: "Cocoa" }, {
    paper: "#211a17", "paper-deep": "#2c2320", ink: "#efe4dc", "ink-soft": "#b1a096", "on-accent": "#1a1310",
    sheet: "#33292a", "sheet-line": "#54444a",
  }, { mid: "#62bfa4", high: "#f0907a", low: "#90a9ee", vowel: "#e8ae72" }),
];

export const THEME_BY_ID = new Map(THEMES.map((t) => [t.id, t]));
export const DEFAULT_THEME: Record<ThemeMode, ThemeId> = { light: "celadon", dark: "midnight" };

/** Script chạy trong <head> trước khi vẽ trang: áp giao diện, màu và kiểu giấy đã lưu để không bị nháy. */
export const THEME_BOOT_SCRIPT = `try{var T=${JSON.stringify(Object.fromEntries(THEMES.map((t) => [t.id, { mode: t.mode, vars: t.vars }])))};var s=JSON.parse(localStorage.getItem(${JSON.stringify(PREFS_STORAGE_KEY)})||"{}").state||{};var d=document.documentElement;var th=T[s.themeId];d.dataset.paper=s.paper||"lines";if(th){d.dataset.theme=th.mode;var o=(s.palette&&s.palette[s.themeId])||{};for(var k in th.vars)d.style.setProperty("--color-"+k,o[k]||th.vars[k])}else d.dataset.theme=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch(e){}`;
