import { PREFS_STORAGE_KEY, type PaletteKey, type SurfaceKey, type SkinVarKey } from './palette';

/**
 * Skin = một bộ giao diện trọn gói: màu (ở đây) cộng kiểu dáng (bo góc, viền, bóng, kính mờ, phát sáng, font tiêu đề)
 * nằm ở globals.css theo `[data-skin="<id>"]`. Không còn chế độ sáng/tối riêng: mỗi skin tự quyết định nền sáng hay tối.
 */
export type SkinId = 'flat' | 'notebook';

export interface SkinDef {
  id: SkinId;
  /** Skin đang phát triển: hiện trong Tuỳ chỉnh nhưng chưa chọn được, và mọi giá trị đã lưu của nó bị bỏ qua. */
  disabled?: boolean;
  vars: Record<SkinVarKey, string>;
}

/** Bảng màu thành phần âm tiết (phụ âm đầu, nguyên âm, âm cuối, thanh) của một skin. */
type Parts = Record<PaletteKey, string>;

const make = (id: SkinId, surface: Record<SurfaceKey, string>, parts: Parts, disabled = false): SkinDef => ({ id, vars: { ...parts, ...surface }, ...(disabled && { disabled }) });

/** Màu thành phần dành cho nền sáng: màu nền sáng của bảng áp phích, chữ trên đó là `on-accent` (mực đậm). */
const LIGHT_PARTS: Parts = {
  mid: '#7bc67e',
  high: '#ffa552',
  low: '#2ab7ca',
  'part-vowel': '#8e7df0',
  'part-final': '#fed766',
  'tone-mid': '#8a94a6',
  'tone-low': '#8e7df0',
  'tone-falling': '#ff8fa3',
  'tone-high': '#fed766',
  'tone-rising': '#2ab7ca',
};

/**
 * Các skin có sẵn. Tên hiển thị: ui.settings.skins.<id>.
 * - flat: áp phích phẳng, vuông góc, viền mực (mặc định, trùng globals.css)
 * - notebook: vở kẻ ngang, mực xanh, đường lề đỏ, nét viền hơi run như vẽ tay (đang phát triển, tạm tắt)
 */
export const SKINS: SkinDef[] = [
  make(
    'flat',
    {
      paper: '#f4f4f8',
      'paper-deep': '#e6e6ea',
      ink: '#24304a',
      'ink-soft': '#5b6478',
      'on-accent': '#141a2b',
      sheet: '#ffffff',
      'sheet-line': '#d4d5de',
      margin: '#ff8fa3',
      removed: '#d0312f',
      brand: '#c84000',
    },
    LIGHT_PARTS,
  ),
  make(
    'notebook',
    {
      paper: '#f5eedc',
      'paper-deep': '#eadfc6',
      ink: '#1f2a4a',
      'ink-soft': '#566079',
      'on-accent': '#14130f',
      sheet: '#fffdf2',
      'sheet-line': '#b5c8e0',
      margin: '#e07b7b',
      removed: '#b3261e',
      brand: '#b3261e',
    },
    LIGHT_PARTS,
    true,
  ),
];

export const SKIN_BY_ID = new Map(SKINS.map((s) => [s.id, s]));
/** Chỉ các skin đã bật mới được áp dụng. */
export const isSkinEnabled = (id: unknown): id is SkinId => SKIN_BY_ID.get(id as SkinId)?.disabled !== true && SKIN_BY_ID.has(id as SkinId);
/** Sáng/tối là một lớp tách khỏi skin: chế độ tối chỉ thay màu bề mặt (giấy, mực, tờ ghi chú, màu nhấn), còn màu thành phần âm tiết giữ nguyên vì chúng là nền sáng và biến thể -ink tự pha với mực nên sáng lên theo. */
export type ThemeMode = 'light' | 'dark';
export const DARK_SURFACE: Partial<Record<SurfaceKey, string>> = {
  paper: '#1c1a17',
  'paper-deep': '#26231f',
  ink: '#f1ece4',
  'ink-soft': '#b3aa9e',
  sheet: '#252320',
  'sheet-line': '#4a443c',
  margin: '#a8605c',
  removed: '#ff8a70',
  brand: '#2ab7ca',
};

/** Mặc định không chọn skin nào: giao diện lấy thẳng từ globals.css (trùng màu skin flat, có test giữ cho khớp), không gắn data-skin và không ghi màu lên <html>. */
export const DEFAULT_SKIN: SkinId | null = null;
/** Khoá lưu màu người dùng chỉnh khi chưa chọn skin nào. */
export const BASE_SCOPE = 'base';
export type PaletteScope = SkinId | typeof BASE_SCOPE;
/** Màu hiển thị làm gốc trong Tuỳ chỉnh khi chưa chọn skin: chính là màu mặc định ở globals.css. */
export const BASE_VARS = (SKINS.find((s) => s.id === 'flat') as SkinDef).vars;

/** Script chạy trong <head> trước khi vẽ trang: áp skin, màu, sáng/tối và kiểu giấy đã lưu để không bị nháy. Chưa chọn skin thì chỉ áp màu người dùng đã chỉnh (khoá "base"). */
export const SKIN_BOOT_SCRIPT = `try{var T=${JSON.stringify(Object.fromEntries(SKINS.filter((s) => !s.disabled).map((s) => [s.id, s.vars])))};var D=${JSON.stringify(DARK_SURFACE)};var s=JSON.parse(localStorage.getItem(${JSON.stringify(PREFS_STORAGE_KEY)})||"{}").state||{};var d=document.documentElement;d.dataset.paper=s.paper||"tiers";var m=s.theme==="dark"?"dark":"light";d.dataset.theme=m;d.style.colorScheme=m;var v=T[s.skinId];if(v)d.dataset.skin=s.skinId;var o=(s.palette&&s.palette[v?s.skinId:"${BASE_SCOPE}"])||{};for(var k in v||o)d.style.setProperty("--color-"+k,o[k]||v[k]);if(m==="dark")for(var k in D)d.style.setProperty("--color-"+k,D[k])}catch(e){}`;
