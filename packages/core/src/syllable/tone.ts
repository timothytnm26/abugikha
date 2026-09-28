import type { L10n } from "../i18n";

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
    label: { vi: "Ngang", en: "Mid" }, thai: "สามัญ", chao: [3, 3], diacritic: "",
    desc: { vi: "Giống thanh ngang, giữ đều ở giữa giọng.", en: "Level, in the middle of your normal speaking range." },
  },
  low: {
    label: { vi: "Trầm", en: "Low" }, thai: "เอก", chao: [2, 1], diacritic: "\u0300",
    desc: { vi: "Thấp hơn thanh ngang, hơi đi xuống. Gần thanh huyền nhưng phẳng và trầm hơn.", en: "Below mid and slightly falling, like a calm, low “oh.”" },
  },
  falling: {
    label: { vi: "Rơi", en: "Falling" }, thai: "โท", chao: [4, 5, 1], diacritic: "\u0302",
    desc: { vi: "Lên cao rồi rơi mạnh, như khi nói dứt khoát “Hả!”. Tiếng Việt không có thanh tương đương.", en: "Rises high then drops sharply, like an emphatic “No!”" },
  },
  high: {
    label: { vi: "Cao", en: "High" }, thai: "ตรี", chao: [4, 5], diacritic: "\u0301",
    desc: { vi: "Cao và hơi vút lên cuối. Gần thanh sắc nhưng kéo dài, không gắt.", en: "High and slightly rising, like an excited “Wow!”" },
  },
  rising: {
    label: { vi: "Vút", en: "Rising" }, thai: "จัตวา", chao: [2, 1, 4], diacritic: "\u030C",
    desc: { vi: "Hạ xuống rồi vút lên, như giọng hỏi ngạc nhiên. Gần thanh hỏi.", en: "Dips then rises, like a surprised question “Really?”" },
  },
};
