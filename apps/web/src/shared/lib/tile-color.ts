import type { CSSProperties } from "react";
import type { ConsonantClass } from "@abugikha/core/consonant";
import type { ToneMarkId, Tone } from "@abugikha/core/syllable";
import type { VowelGroup } from "@abugikha/core/vowel";
import { tint } from "./color";

/** Một màu của ô chữ: `color` là màu nền sáng, `ink` là biến thể đậm để làm chữ và viền */
export type TileColor = { color: string; ink: string };
export const tileColor = (name: string): TileColor => ({ color: `var(--color-${name})`, ink: `var(--color-${name}-ink)` });

/** Cùng công thức với các màu `-ink` trong globals.css: 35% màu + 65% mực */
export const inkOf = (color: string): string => `color-mix(in oklab, ${color} 35%, var(--color-ink))`;

/** Nguyên âm thường: tím. Nguyên âm ghép và đặc biệt: chàm (chưa có trong bảng màu nên pha từ tím với xanh để đổi theo skin) */
const VOWEL_PURPLE = tileColor("part-vowel");
const INDIGO = "color-mix(in oklab, var(--color-part-vowel) 55%, #1d4ed8)";
const VOWEL_INDIGO: TileColor = { color: INDIGO, ink: inkOf(INDIGO) };
export const vowelTileColor = (group: VowelGroup) => (group === "diph" || group === "special" ? VOWEL_INDIGO : VOWEL_PURPLE);
export const classTileColor = (cls: ConsonantClass): TileColor => tileColor(cls);
export const toneTileColor = (tone: Tone): TileColor => tileColor(`tone-${tone}`);
/** Chữ số: vàng hết. Dấu thanh: màu của thanh mà dấu cho khi đứng sau chữ giữa (ek→low, tho→falling, tri→high, chattawa→rising) */
export const DIGIT_TILE_COLOR = tileColor("tone-high");
const MARK_TONE: Record<ToneMarkId, string> = { ek: "low", tho: "falling", tri: "high", chattawa: "rising" };
export const markTileColor = (id: ToneMarkId) => tileColor(`tone-${MARK_TONE[id]}`);

/** Màu vai trò của các mảnh âm tiết ở phần giới thiệu: phụ âm đầu cam, nguyên âm tím, phụ âm cuối xanh dương */
export const ROLE_TILE_COLOR = {
  initial: tileColor("note-orange"),
  vowel: VOWEL_PURPLE,
  final: tileColor("low"),
} as const;

/** Nhãn nhỏ cùng màu nền đặc với ô đang chọn trong bảng; không viền */
export const chipTile = ({ tile }: { tile: TileColor }) => ({
  className: "rounded-lg px-2.5 py-0.5 text-xs font-medium",
  style: { backgroundColor: tile.color, color: "var(--color-on-accent)" } satisfies CSSProperties,
});

/** Ô chữ lớn: nền nhạt, viền 2px và chữ cùng màu `ink` của ô */
export const washBox = ({ tile }: { tile: TileColor }) => ({
  className: "rounded-lg border-2 border-solid",
  style: { borderColor: tile.ink, color: tile.ink, backgroundColor: tint(tile.color, 25) } satisfies CSSProperties,
});
