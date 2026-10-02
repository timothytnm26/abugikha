import type { CSSProperties } from 'react';
import { vowelGroup } from '@abugikha/core/vowel';
import type { Selected } from './selection';
import { CLASS_META, type ConsonantClass } from '@/entities/consonant';
import type { Vowel } from '@/entities/vowel';
import { vowelGlyph } from '@/entities/vowel';
import { DIGIT_TILE_COLOR, classTileColor, cn, markTileColor, tint, vowelTileColor, type TileColor } from '@/shared/lib';

export { DIGIT_TILE_COLOR, chipTile, classTileColor, markTileColor, vowelTileColor } from '@/shared/lib';

/** Thứ tự nhóm khi liệt kê: giữa - cao - thấp */
export const CLASS_ORDER = ['mid', 'high', 'low'] as const;
/** Các nút lọc phụ âm theo nhóm */
export const CLASS_FILTERS = ['all', ...CLASS_ORDER] as const;

/** Ô đang chọn của phụ âm: quầng sáng theo màu nhóm thay vì viền trắng */
export const CLASS_RING: Record<ConsonantClass, string> = { mid: 'ring-mid', high: 'ring-high', low: 'ring-low' };

/** Kiểu "nhạt" của một màu: dùng chung cho ô chữ ít gặp, pill lọc chưa chọn và ô nguyên âm ngắn để các nơi luôn giống nhau */
export const softStyle = (color: string, ink: string) => ({
  backgroundColor: tint(color, 14),
  color: ink,
  boxShadow: `inset 0 0 0 1.5px ${tint(color, 35)}`,
});
export const softClassStyle = (cls: ConsonantClass) => softStyle(CLASS_META[cls].color, CLASS_META[cls].ink);

const TILE_BASE = 'flex shrink-0 items-center justify-center rounded-lg border-2 text-center transition-[scale] hover:scale-105';

/**
 * Một công thức màu cho ô nguyên âm, chữ số và dấu thanh: viền và chữ luôn là màu `ink` của ô;
 * nền trong suốt hoặc nhạt (`wash`); đang chọn = nền đặc màu của ô, chữ on-accent.
 */
const glyphTile = ({ active, wash, dashed, tile }: { active: boolean; wash: boolean; dashed?: boolean; tile: TileColor }) => ({
  className: cn(TILE_BASE, dashed ? 'border-dashed' : 'border-solid'),
  style: {
    borderColor: tile.ink,
    color: active ? 'var(--color-on-accent)' : tile.ink,
    backgroundColor: active ? tile.color : wash ? tint(tile.color, 25) : 'transparent',
  } satisfies CSSProperties,
});

/** Ô nguyên âm: ngắn = viền nét đứt, dài = viền liền; biến hình thì có nền nhạt */
export const vowelTile = ({ active, short, morph, tile }: { active: boolean; short: boolean; morph: boolean; tile: TileColor }) =>
  glyphTile({ active, wash: morph, dashed: short, tile });

/** Ô chữ số / dấu thanh: luôn có nền nhạt */
export const washTile = ({ active, tile }: { active: boolean; tile: TileColor }) => glyphTile({ active, wash: true, tile });

export const pill = (on: boolean) => cn('h-full min-w-13 rounded-sm px-2 py-1 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink', on ? 'bg-ink text-paper' : 'bg-paper-deep hover:bg-ink/10');

/** Các dạng khi có âm cuối, kể cả dạng riêng theo âm cuối (vd. เ◌อ: เ◌ิ◌, gặp ย thành เ◌ย) */
export const closedForms = (v: Vowel) => [vowelGlyph(v, 'closed'), ...Object.entries(v.closedBy ?? {}).map(([f, pattern]) => `+ ${f} → ${pattern.replace('C', '◌').replace('F', f)}`)];

/** Màu của chữ đang chọn, dùng cho các chi tiết trang trí ở khung preview */
export const selectionTileColor = (sel: Selected): TileColor => {
  switch (sel.kind) {
    case 'consonant':
    case 'initial':
      return classTileColor(sel.item.cls);
    case 'vowel':
      return vowelTileColor(vowelGroup(sel.item));
    case 'digit':
      return DIGIT_TILE_COLOR;
    case 'tone':
      return markTileColor(sel.item.id);
  }
};
