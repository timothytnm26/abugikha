import type { L10n } from "@/shared/i18n";
import type { ConsonantClass } from "./types";

/** `color` là CSS var nên tự đổi theo theme sáng/tối. */
export const CLASS_META: Record<ConsonantClass, { label: L10n; thai: string; color: string; bg: string; text: string }> = {
  mid: { label: { vi: "Trung", en: "Mid" }, thai: "อักษรกลาง", color: "var(--color-mid)", bg: "bg-mid", text: "text-mid" },
  high: { label: { vi: "Cao", en: "High" }, thai: "อักษรสูง", color: "var(--color-high)", bg: "bg-high", text: "text-high" },
  low: { label: { vi: "Thấp", en: "Low" }, thai: "อักษรต่ำ", color: "var(--color-low)", bg: "bg-low", text: "text-low" },
};
