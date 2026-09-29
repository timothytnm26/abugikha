import { CLASS_META, type ConsonantClass } from "../consonant";
import type { VowelLength } from "../vowel";
import { DEFAULT_LOCALE, type Locale } from "../i18n";
import type { Liveness, Tone, ToneMarkId } from "./tone";
import { CATALOGS, fmt } from "@abugikha/i18n";

export interface ToneRuleInput {
  cls: ConsonantClass;
  liveness: Liveness;
  length: VowelLength;
  mark: ToneMarkId | null;
}

/** Bảng quy tắc thanh điệu chuẩn của tiếng Thái. */
export function resolveTone({ cls, liveness, length, mark }: ToneRuleInput, locale: Locale = DEFAULT_LOCALE): { tone: Tone; rule: string; irregular?: string } {
  const m = CATALOGS[locale].analysis;
  const c = CLASS_META[cls].label[locale];
  if (mark === "tri") return { tone: "high", rule: m.tri, irregular: cls !== "mid" ? m.triRare : undefined };
  if (mark === "chattawa") return { tone: "rising", rule: m.chattawa, irregular: cls !== "mid" ? m.chattawaRare : undefined };
  if (mark === "ek") return cls === "low" ? { tone: "falling", rule: m.ekLow } : { tone: "low", rule: fmt(m.ekOther, { cls: c }) };
  if (mark === "tho") return cls === "low" ? { tone: "high", rule: m.thoLow } : { tone: "falling", rule: fmt(m.thoOther, { cls: c }) };
  if (liveness === "live") return cls === "high" ? { tone: "rising", rule: m.liveHigh } : { tone: "mid", rule: fmt(m.liveOther, { cls: c }) };
  if (cls === "low") return length === "short" ? { tone: "high", rule: m.deadLowShort } : { tone: "falling", rule: m.deadLowLong };
  return { tone: "low", rule: fmt(m.deadOther, { cls: c }) };
}
