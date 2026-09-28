import { toneKey } from "@abugikha/core";
import { TONE_META as TONE_INFO, type Tone } from "@abugikha/core/syllable";
import { paletteVar } from "@/shared/config/palette";

/** Thông tin thanh từ core + màu của web; `color` là CSS var nên tự đổi theo theme. */
export const TONE_META = Object.fromEntries(
  (Object.keys(TONE_INFO) as Tone[]).map((t) => [t, { ...TONE_INFO[t], color: paletteVar(toneKey(t)) }]),
) as Record<Tone, (typeof TONE_INFO)[Tone] & { color: string }>;
