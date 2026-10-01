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

/** Màu thành phần dành cho nền sáng: màu nền sáng của bảng áp phích, chữ trên đó là `on-accent` (đen). */
const LIGHT_PARTS: Parts = {
  mid: '#12bd0c',
  high: '#ff5200',
  low: '#1e9fe8',
  'part-vowel': '#b07aff',
  'part-final': '#cdfb1c',
  'tone-mid': '#c9cdc9',
  'tone-low': '#b07aff',
  'tone-falling': '#f47b6b',
  'tone-high': '#ffe100',
  'tone-rising': '#1e9fe8',
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
      paper: '#f4efe9',
      'paper-deep': '#e9e1d7',
      ink: '#1b1a17',
      'ink-soft': '#5e5750',
      'on-accent': '#14130f',
      sheet: '#fbf8f3',
      'sheet-line': '#d3c8ba',
      margin: '#d98a86',
      removed: '#c2361c',
      brand: '#c23d00',
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
export const DEFAULT_SKIN: SkinId = 'flat';

/** Script chạy trong <head> trước khi vẽ trang: áp skin, màu và kiểu giấy đã lưu để không bị nháy. */
export const SKIN_BOOT_SCRIPT = `try{var T=${JSON.stringify(Object.fromEntries(SKINS.filter((s) => !s.disabled).map((s) => [s.id, s.vars])))};var s=JSON.parse(localStorage.getItem(${JSON.stringify(PREFS_STORAGE_KEY)})||"{}").state||{};var d=document.documentElement;var v=T[s.skinId]||T.${DEFAULT_SKIN};d.dataset.paper=s.paper||"tiers";d.dataset.skin=T[s.skinId]?s.skinId:"${DEFAULT_SKIN}";var o=(s.palette&&s.palette[d.dataset.skin])||{};for(var k in v)d.style.setProperty("--color-"+k,o[k]||v[k])}catch(e){}`;
