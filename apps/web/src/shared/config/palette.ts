import type { PaletteKey } from "@abugikha/core";

export { CLASS_KEYS, TONE_KEYS, PALETTE_KEYS, DEFAULT_PALETTE, type PaletteKey } from "@abugikha/core";

/** Màu CSS của một khoá palette; là CSS var nên tự đổi theo theme sáng/tối và màu người dùng chọn. */
export const paletteVar = (key: PaletteKey) => `var(--color-${key})`;

export const PREFS_STORAGE_KEY = "kaa-prefs";

/** Script chạy trong <head> trước khi vẽ trang: áp bảng màu đã lưu, tránh nháy màu. */
export const PALETTE_BOOT_SCRIPT = `try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(PREFS_STORAGE_KEY)})||"{}").state;var d=document.documentElement;var c=document.cookie.split(";").map(function(x){return x.trim()}).find(function(x){return x.indexOf("theme=")===0});var saved=c&&c.slice(6);var t=d.dataset.theme||(saved==="light"||saved==="dark"?saved:(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"));d.dataset.theme=t;var p=s&&s.palette&&s.palette[t];if(p)for(var k in p)d.style.setProperty("--color-"+k,p[k])}catch(e){}`;
