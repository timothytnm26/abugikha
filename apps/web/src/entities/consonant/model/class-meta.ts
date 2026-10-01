import { CLASS_META as CLASS_INFO, type ConsonantClass } from "@abugikha/core/consonant";
import { paletteInkVar, paletteVar } from "@/shared/config/palette";

/** Viết rõ tên class để Tailwind quét được. */
const STYLE: Record<ConsonantClass, { bg: string; text: string }> = {
  mid: { bg: "bg-mid", text: "text-mid-ink" },
  high: { bg: "bg-high", text: "text-high-ink" },
  low: { bg: "bg-low", text: "text-low-ink" },
};

/** Thông tin lớp phụ âm từ core + màu của web; `color` là màu nền, `ink` là màu chữ/nét tương ứng; cả hai là CSS var nên tự đổi theo skin. */
export const CLASS_META = Object.fromEntries(
  (Object.keys(CLASS_INFO) as ConsonantClass[]).map((c) => [c, { ...CLASS_INFO[c], ...STYLE[c], color: paletteVar(c), ink: paletteInkVar(c) }]),
) as Record<ConsonantClass, (typeof CLASS_INFO)[ConsonantClass] & { bg: string; text: string; color: string; ink: string }>;
