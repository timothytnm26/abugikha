import { CLASS_KEYS, TONE_KEYS, type PaletteKey as CorePaletteKey } from '@abugikha/core';

export { CLASS_KEYS, TONE_KEYS, PALETTE_KEYS as CORE_PALETTE_KEYS, DEFAULT_PALETTE, type PaletteKey as CorePaletteKey } from '@abugikha/core';

/** Màu vai trò của nguyên âm và phụ âm cuối (đã dùng ở phần nguyên âm biến hình, nay tô cả âm tiết). */
export const PART_KEYS = ['part-vowel', 'part-final'] as const;
/** Mọi màu người dùng chỉnh được ở web: nhóm phụ âm, nguyên âm, âm cuối, dấu thanh theo thanh. */
export const PALETTE_KEYS = [...CLASS_KEYS, ...PART_KEYS, ...TONE_KEYS] as const;
export type PaletteKey = CorePaletteKey | (typeof PART_KEYS)[number];

/** Màu nền, chữ, giấy và màu nhấn thương hiệu: do skin quyết định, người dùng không chỉnh từng màu. */
export const SURFACE_KEYS = ['paper', 'paper-deep', 'ink', 'ink-soft', 'on-accent', 'sheet', 'sheet-line', 'margin', 'removed', 'brand'] as const;
export type SurfaceKey = (typeof SURFACE_KEYS)[number];
export type SkinVarKey = PaletteKey | SurfaceKey;

/** "tiers" = vở 4 tầng (mặc định); các kiểu còn lại thay các tầng bằng nền giấy kẻ. */
export const PAPER_STYLES = ['tiers', 'lines', 'grid', 'dots', 'plain'] as const;
export type PaperStyle = (typeof PAPER_STYLES)[number];

/** Màu CSS của một khoá palette; là CSS var nên tự đổi theo skin và màu người dùng chọn. */
export const paletteVar = (key: PaletteKey) => `var(--color-${key})`;
/** Biến thể đậm của màu để làm chữ/nét trên giấy: màu gốc là nền sáng, chỉ đọc được khi đặt chữ đen lên nó (xem globals.css). */
export const paletteInkVar = (key: PaletteKey) => `var(--color-${key}-ink)`;

export const PREFS_STORAGE_KEY = 'narakthai-prefs';
