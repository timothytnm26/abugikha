import { CLASS_META, type ConsonantClass } from "../../consonant/@x/syllable";
import type { VowelLength } from "../../vowel/@x/syllable";
import type { Locale } from "@/shared/i18n";
import type { Liveness, Tone, ToneMarkId } from "../model/tone";
import { MSG } from "./messages";

export interface ToneRuleInput {
  cls: ConsonantClass;
  liveness: Liveness;
  length: VowelLength;
  mark: ToneMarkId | null;
}

/** Bảng quy tắc thanh điệu chuẩn của tiếng Thái. */
export function resolveTone({ cls, liveness, length, mark }: ToneRuleInput, locale: Locale = "vi"): { tone: Tone; rule: string; irregular?: string } {
  const m = MSG[locale];
  const c = CLASS_META[cls].label[locale];
  if (mark === "tri") return { tone: "high", rule: m.tri, irregular: cls !== "mid" ? m.triRare : undefined };
  if (mark === "chattawa") return { tone: "rising", rule: m.chattawa, irregular: cls !== "mid" ? m.chattawaRare : undefined };
  if (mark === "ek") return cls === "low" ? { tone: "falling", rule: m.ekLow } : { tone: "low", rule: m.ekOther(c) };
  if (mark === "tho") return cls === "low" ? { tone: "high", rule: m.thoLow } : { tone: "falling", rule: m.thoOther(c) };
  if (liveness === "live") return cls === "high" ? { tone: "rising", rule: m.liveHigh } : { tone: "mid", rule: m.liveOther(c) };
  if (cls === "low") return length === "short" ? { tone: "high", rule: m.deadLowShort } : { tone: "falling", rule: m.deadLowLong };
  return { tone: "low", rule: m.deadOther(c) };
}
