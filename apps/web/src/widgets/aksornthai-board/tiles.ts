import type { ConsonantClass } from "@/entities/consonant";
import type { Vowel } from "@/entities/vowel";
import { vowelGlyph } from "@/entities/vowel";
import { cn } from "@/shared/lib";

/** Ô đang chọn của phụ âm: quầng sáng theo màu nhóm thay vì viền trắng */
export const CLASS_RING: Record<ConsonantClass, string> = { mid: "ring-mid", high: "ring-high", low: "ring-low" };

/**
 * Ô nguyên âm / dấu thanh. `cn` chỉ nối chuỗi nên mỗi trạng thái chỉ có đúng một màu viền:
 * đang chọn = đảo màu (như nút lọc), biến hình = viền tím, ngắn = nét đứt.
 */
export const glyphTile = ({ active, morph, short }: { active: boolean; morph: boolean; short?: boolean }) =>
  cn(
    "flex shrink-0 items-center justify-center text-center transition-colors",
    short ? "border-dashed" : "border-solid",
    morph ? "border-[1.5px]" : "border",
    active
      ? "border-ink bg-ink text-paper"
      : cn("bg-paper-deep hover:bg-paper", morph ? "border-part-vowel/70" : short ? "border-ink/30" : "border-ink/10"),
  );

export const pill = (on: boolean) =>
  cn(
    "px-1 py-1 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
    on ? "bg-ink text-paper" : "bg-paper-deep hover:bg-ink/10",
  );

/** Các dạng khi có âm cuối, kể cả dạng riêng theo âm cuối (vd. เ◌อ: เ◌ิ◌, gặp ย thành เ◌ย) */
export const closedForms = (v: Vowel) => [
  vowelGlyph(v, "closed"),
  ...Object.entries(v.closedBy ?? {}).map(([f, pattern]) => `+ ${f} → ${pattern.replace("C", "◌").replace("F", f)}`),
];
