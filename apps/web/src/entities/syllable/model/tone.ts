import { toneKey } from "@abugikha/core";
import { TONE_META as TONE_INFO, type Tone } from "@abugikha/core/syllable";
import { paletteInkVar, paletteVar } from "@/shared/config/palette";

/** Thông tin thanh từ core + màu của web; `color` là màu nền, `ink` là màu chữ/nét tương ứng; cả hai là CSS var nên tự đổi theo skin. */
export const TONE_META = Object.fromEntries(
  (Object.keys(TONE_INFO) as Tone[]).map((t) => [t, { ...TONE_INFO[t], color: paletteVar(toneKey(t)), ink: paletteInkVar(toneKey(t)) }]),
) as Record<Tone, (typeof TONE_INFO)[Tone] & { color: string; ink: string }>;
