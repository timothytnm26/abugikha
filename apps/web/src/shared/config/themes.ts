import { DEFAULT_PALETTE } from "@abugikha/core";
import { PREFS_STORAGE_KEY, type PaletteKey, type SurfaceKey, type ThemeVarKey } from "./palette";

export type ThemeMode = "light" | "dark";
export type ThemeId = "celadon" | "sakura" | "matcha" | "sepia" | "midnight" | "twilight" | "cocoa";

export interface ThemeDef {
  id: ThemeId;
  mode: ThemeMode;
  vars: Record<ThemeVarKey, string>;
}

/** Màu vai trò nguyên âm / âm cuối chung cho từng chế độ (trùng globals.css). */
const PARTS: Record<ThemeMode, Pick<Record<PaletteKey, string>, "part-vowel" | "part-final">> = {
  light: { "part-vowel": "#5b45c4", "part-final": "#1d7f4e" },
  dark: { "part-vowel": "#a996ff", "part-final": "#4fd39a" },
};

const make = (
  id: ThemeId,
  mode: ThemeMode,
  surface: Record<SurfaceKey, string>,
  parts: Partial<Record<PaletteKey, string>> = {},
): ThemeDef => ({ id, mode, vars: { ...DEFAULT_PALETTE[mode], ...PARTS[mode], ...parts, ...surface } });

/**
 * Bảng giao diện có sẵn. Nền luôn ngả xám/kem thay vì trắng hoặc đen tuyền; độ tương phản chữ vẫn đủ đọc
 * nhưng không chói, để học lâu không mỏi mắt. Tên hiển thị nằm ở catalog: ui.settings.themes.<id>.
 */
export const THEMES: ThemeDef[] = [
  make("celadon", "light", {
    paper: "#eef1ec", "paper-deep": "#e1e8e1", ink: "#1e2833", "ink-soft": "#5a6672", "on-accent": "#ffffff",
    sheet: "#fbfbf4", "sheet-line": "#b9c9c9", margin: "#d98a86",
  }),
  make("sakura", "light", {
    paper: "#f6eeeb", "paper-deep": "#eddfdb", ink: "#3a2c32", "ink-soft": "#7a6870", "on-accent": "#ffffff",
    sheet: "#fffaf6", "sheet-line": "#e3c4c4", margin: "#d98a86",
  }, { mid: "#3a8574", high: "#bd4a3c", low: "#4a62ae", "part-vowel": "#6c4fb8", "part-final": "#26794c" }),
  make("matcha", "light", {
    paper: "#ecefe1", "paper-deep": "#dfe5d0", ink: "#262f1f", "ink-soft": "#626c55", "on-accent": "#ffffff",
    sheet: "#f9faee", "sheet-line": "#c2cfa8", margin: "#d5968a",
  }, { mid: "#2c7a5c", low: "#3b5ea3", "part-vowel": "#5e45bd", "part-final": "#5e6d1a" }),
  make("sepia", "light", {
    paper: "#f0e8d6", "paper-deep": "#e5dbc3", ink: "#3b3226", "ink-soft": "#786c59", "on-accent": "#fffdf7",
    sheet: "#fbf4e2", "sheet-line": "#d6c7a2", margin: "#cf8f80",
  }, { mid: "#3a7566", high: "#ad4630", low: "#3d5a9c", "part-vowel": "#6a4fae", "part-final": "#4f7a2a" }),
  make("midnight", "dark", {
    paper: "#121a1d", "paper-deep": "#1b262a", ink: "#e3ebe6", "ink-soft": "#9aaaa2", "on-accent": "#0f1518",
    sheet: "#1f2b2f", "sheet-line": "#3a4c52", margin: "#8e4f4c",
  }),
  make("twilight", "dark", {
    paper: "#1a1929", "paper-deep": "#252438", ink: "#e6e3f0", "ink-soft": "#a5a2bc", "on-accent": "#14131f",
    sheet: "#2a2940", "sheet-line": "#45435f", margin: "#8c5670",
  }, { mid: "#66c4ae", high: "#f08c78", low: "#93aaf2" }),
  make("cocoa", "dark", {
    paper: "#211a17", "paper-deep": "#2c2320", ink: "#efe4dc", "ink-soft": "#b1a096", "on-accent": "#1a1310",
    sheet: "#33292a", "sheet-line": "#54444a", margin: "#94534d",
  }, { mid: "#62bfa4", high: "#f0907a", low: "#90a9ee" }),
];

export const THEME_BY_ID = new Map(THEMES.map((t) => [t.id, t]));
export const DEFAULT_THEME: Record<ThemeMode, ThemeId> = { light: "celadon", dark: "midnight" };

/** Script chạy trong <head> trước khi vẽ trang: áp giao diện, màu và kiểu giấy đã lưu để không bị nháy. */
export const THEME_BOOT_SCRIPT = `try{var T=${JSON.stringify(Object.fromEntries(THEMES.map((t) => [t.id, { mode: t.mode, vars: t.vars }])))};var s=JSON.parse(localStorage.getItem(${JSON.stringify(PREFS_STORAGE_KEY)})||"{}").state||{};var d=document.documentElement;var th=T[s.themeId];d.dataset.paper=s.paper||"tiers";if(th){d.dataset.theme=th.mode;var o=(s.palette&&s.palette[s.themeId])||{};for(var k in th.vars)d.style.setProperty("--color-"+k,o[k]||th.vars[k])}else d.dataset.theme=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch(e){}`;
