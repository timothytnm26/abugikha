import { l10n, type L10n } from "@abugikha/i18n";
import type { ConsonantClass } from "./types";

export const CLASS_META: Record<ConsonantClass, { label: L10n; thai: string }> = {
  mid: { label: l10n(["consonants", "class", "mid"]), thai: "อักษรกลาง" },
  high: { label: l10n(["consonants", "class", "high"]), thai: "อักษรสูง" },
  low: { label: l10n(["consonants", "class", "low"]), thai: "อักษรต่ำ" },
};
