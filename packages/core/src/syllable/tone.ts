import { l10n, type L10n } from "@abugikha/i18n";

export type Tone = "mid" | "low" | "falling" | "high" | "rising";
export type ToneMarkId = "ek" | "tho" | "tri" | "chattawa";
export type Liveness = "live" | "dead";

export interface ToneMark {
  id: ToneMarkId;
  char: string;
  thai: string;
  latin: string;
}

export const TONE_MARKS: ToneMark[] = [
  { id: "ek", char: "่", thai: "ไม้เอก", latin: "mai ek" },
  { id: "tho", char: "้", thai: "ไม้โท", latin: "mai tho" },
  { id: "tri", char: "๊", thai: "ไม้ตรี", latin: "mai tri" },
  { id: "chattawa", char: "๋", thai: "ไม้จัตวา", latin: "mai chattawa" },
];
export const TONE_MARK_BY_ID = new Map(TONE_MARKS.map((m) => [m.id, m]));

export const TONE_META: Record<Tone, { label: L10n; thai: string; chao: number[]; diacritic: string; desc: L10n }> = {
  mid: {
    label: l10n(["tones", "label", "mid"]), thai: "สามัญ", chao: [3, 3], diacritic: "",
    desc: l10n(["tones", "desc", "mid"]),
  },
  low: {
    label: l10n(["tones", "label", "low"]), thai: "เอก", chao: [2, 1], diacritic: "\u0300",
    desc: l10n(["tones", "desc", "low"]),
  },
  falling: {
    label: l10n(["tones", "label", "falling"]), thai: "โท", chao: [4, 5, 1], diacritic: "\u0302",
    desc: l10n(["tones", "desc", "falling"]),
  },
  high: {
    label: l10n(["tones", "label", "high"]), thai: "ตรี", chao: [4, 5], diacritic: "\u0301",
    desc: l10n(["tones", "desc", "high"]),
  },
  rising: {
    label: l10n(["tones", "label", "rising"]), thai: "จัตวา", chao: [2, 1, 4], diacritic: "\u030C",
    desc: l10n(["tones", "desc", "rising"]),
  },
};
