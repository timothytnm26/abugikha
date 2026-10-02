import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { AA_CONTRAST, contrastRatio } from '../lib/color';

const css = readFileSync(fileURLToPath(new URL('../../app/styles/globals.css', import.meta.url)), 'utf8');
/** Bảng màu áp phích của một skin: mặc định (flat) nằm ở @theme, skin khác ghi đè --color-note-* trong khối [data-skin] của nó. */
const posterIn = (block: string) => Object.fromEntries([...block.matchAll(/--color-note-(\w+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2].toLowerCase()]));
const flatPoster = posterIn(css.match(/@theme static \{[\s\S]*?\n\}/)?.[0] ?? '');
const posterOf = (skin: string) => ({ ...flatPoster, ...posterIn(css.match(new RegExp(`\\n\\[data-skin="${skin}"\\]\\s*\\{([^}]*)\\}`))?.[1] ?? '') });

/** Cặp chữ trên nền đang dùng ở shared/ui/poster-tile.tsx (TILE) cùng các cặp phụ: dải màu, chữ phụ và viền đậm. */
const PAIRS: [text: string, bg: string][] = [
  ['white', 'blue'],
  ['cream', 'blue'],
  ['black', 'orange'],
  ['black', 'sky'],
  ['black', 'lime'],
  ['black', 'coral'],
  ['black', 'violet'],
  ['black', 'green'],
  ['black', 'yellow'],
  ['orange', 'black'],
  ['cream', 'black'],
  ['black', 'cream'],
  ['blue', 'cream'],
];

describe.each(['flat', 'notebook'])('bảng màu áp phích của skin %s', (skin) => {
  const poster = posterOf(skin);
  const color = (name: string) => (name === 'white' ? '#ffffff' : poster[name]);

  it('đủ mười một màu', () => {
    expect(Object.keys(poster).sort()).toEqual(['black', 'blue', 'coral', 'cream', 'green', 'lime', 'orange', 'sky', 'taupe', 'violet', 'yellow']);
  });

  it('xám kem đủ 3:1 cho chữ lớn trên nền kem', () => {
    expect(contrastRatio(color('taupe'), color('cream'))).toBeGreaterThanOrEqual(3);
  });

  it.each(PAIRS)('chữ %s trên nền %s đạt AA', (text, bg) => {
    expect(contrastRatio(color(text), color(bg))).toBeGreaterThanOrEqual(AA_CONTRAST);
  });
});
