import type { L10n } from "../i18n";
import type { ConsonantClass } from "./types";

export const CLASS_META: Record<ConsonantClass, { label: L10n; thai: string }> = {
  mid: { label: { vi: "Trung", en: "Mid" }, thai: "อักษรกลาง" },
  high: { label: { vi: "Cao", en: "High" }, thai: "อักษรสูง" },
  low: { label: { vi: "Thấp", en: "Low" }, thai: "อักษรต่ำ" },
};
