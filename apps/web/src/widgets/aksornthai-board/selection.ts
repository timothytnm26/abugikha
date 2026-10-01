import type { Consonant, InitialUnit } from "@/entities/consonant";
import type { ThaiDigit } from "@/entities/writing";
import type { Vowel } from "@/entities/vowel";
import type { ToneMark } from "@/entities/syllable";
import { MORPH_RULES } from "@abugikha/core/syllable";

export type Selected =
  | { kind: "consonant"; item: Consonant }
  | { kind: "initial"; item: InitialUnit }
  | { kind: "vowel"; item: Vowel }
  | { kind: "digit"; item: ThaiDigit }
  | { kind: "tone"; item: ToneMark };

/** Nguyên âm đổi cách viết khi có âm cuối, và quy tắc dấu thanh đẩy ◌็ ra (áp dụng cho mọi dấu thanh) */
const VOWEL_MORPHS = MORPH_RULES.filter((r) => !r.mark);
export const MARK_MORPHS = MORPH_RULES.filter((r) => r.mark);
export const MORPH_VOWEL_IDS = new Set(VOWEL_MORPHS.map((r) => r.vowelId));

export const morphRulesOf = (s: Selected) =>
  s.kind === "vowel" ? VOWEL_MORPHS.filter((r) => r.vowelId === s.item.id) : s.kind === "tone" ? MARK_MORPHS : [];
