import type { Theme } from "../lib/theme";

/** Các màu người dùng tuỳ chỉnh được; tên = hậu tố của CSS var --color-<key>. */
export const CLASS_KEYS = ["mid", "high", "low"] as const;
export const TONE_KEYS = [
  "tone-mid",
  "tone-low",
  "tone-falling",
  "tone-high",
  "tone-rising",
] as const;
export type PaletteKey =
  | (typeof CLASS_KEYS)[number]
  | (typeof TONE_KEYS)[number];

/** Trùng với globals.css */
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

export const PREFS_STORAGE_KEY = "kaa-prefs";

/** Script chạy trong <head> trước khi vẽ trang: áp bảng màu đã lưu, tránh nháy màu. */
export const PALETTE_BOOT_SCRIPT = `try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(PREFS_STORAGE_KEY)})||"{}").state;var d=document.documentElement;var c=document.cookie.split(";").map(function(x){return x.trim()}).find(function(x){return x.indexOf("theme=")===0});var saved=c&&c.slice(6);var t=d.dataset.theme||(saved==="light"||saved==="dark"?saved:(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"));d.dataset.theme=t;var p=s&&s.palette&&s.palette[t];if(p)for(var k in p)d.style.setProperty("--color-"+k,p[k])}catch(e){}`;
