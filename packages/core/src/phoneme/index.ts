import { l10n, l10nOptional, type L10n } from "@abugikha/i18n";

export type Place = "labial" | "alveolar" | "palatal" | "velar" | "glottal";
export type Manner = "unaspirated" | "aspirated" | "voiced" | "nasal" | "fricative" | "approximant" | "trill";

const PLACE_IDS: Place[] = ["labial", "alveolar", "palatal", "velar", "glottal"];
const MANNER_IDS: Manner[] = ["unaspirated", "aspirated", "voiced", "nasal", "fricative", "approximant", "trill"];

/** Mọi chuỗi hiển thị của trang IPA nằm ở locales/<locale>/phonemes.json */
export const PLACES: { id: Place; label: L10n; hint: L10n }[] = PLACE_IDS.map((id) => ({ id, label: l10n(["phonemes", "place", id]), hint: l10n(["phonemes", "placeHint", id]) }));
export const MANNERS: { id: Manner; label: L10n; hint: L10n }[] = MANNER_IDS.map((id) => ({ id, label: l10n(["phonemes", "manner", id]), hint: l10n(["phonemes", "mannerHint", id]) }));

export interface ConsonantPhone {
  ipa: string;
  place: Place;
  manner: Manner;
  example: string;
  exampleIpa: string;
  meaning: L10n;
  note: L10n;
  /** Bẫy thường gặp */
  trap?: L10n;
}

const CONSONANT_RAW: Omit<ConsonantPhone, "meaning" | "note" | "trap">[] = [
  { ipa: "p", place: "labial", manner: "unaspirated", example: "ปลา", exampleIpa: "plaː" },
  { ipa: "pʰ", place: "labial", manner: "aspirated", example: "พ่อ", exampleIpa: "pʰɔ̂ː" },
  { ipa: "b", place: "labial", manner: "voiced", example: "บ้าน", exampleIpa: "bâːn" },
  { ipa: "m", place: "labial", manner: "nasal", example: "แม่", exampleIpa: "mɛ̂ː" },
  { ipa: "f", place: "labial", manner: "fricative", example: "ไฟ", exampleIpa: "faj" },
  { ipa: "w", place: "labial", manner: "approximant", example: "วัน", exampleIpa: "wan" },
  { ipa: "t", place: "alveolar", manner: "unaspirated", example: "ตา", exampleIpa: "taː" },
  { ipa: "tʰ", place: "alveolar", manner: "aspirated", example: "ที่", exampleIpa: "tʰîː" },
  { ipa: "d", place: "alveolar", manner: "voiced", example: "ดี", exampleIpa: "diː" },
  { ipa: "n", place: "alveolar", manner: "nasal", example: "น้ำ", exampleIpa: "náːm" },
  { ipa: "s", place: "alveolar", manner: "fricative", example: "สี", exampleIpa: "sǐː" },
  { ipa: "l", place: "alveolar", manner: "approximant", example: "ลม", exampleIpa: "lom" },
  { ipa: "r", place: "alveolar", manner: "trill", example: "รถ", exampleIpa: "rót" },
  { ipa: "tɕ", place: "palatal", manner: "unaspirated", example: "ใจ", exampleIpa: "tɕaj" },
  { ipa: "tɕʰ", place: "palatal", manner: "aspirated", example: "ช้าง", exampleIpa: "tɕʰáːŋ" },
  { ipa: "j", place: "palatal", manner: "approximant", example: "ยา", exampleIpa: "jaː" },
  { ipa: "k", place: "velar", manner: "unaspirated", example: "กา", exampleIpa: "kaː" },
  { ipa: "kʰ", place: "velar", manner: "aspirated", example: "คน", exampleIpa: "kʰon" },
  { ipa: "ŋ", place: "velar", manner: "nasal", example: "งู", exampleIpa: "ŋuː" },
  { ipa: "ʔ", place: "glottal", manner: "unaspirated", example: "อ่าน", exampleIpa: "ʔàːn" },
  { ipa: "h", place: "glottal", manner: "fricative", example: "หา", exampleIpa: "hǎː" },
];
export const CONSONANT_PHONES: ConsonantPhone[] = CONSONANT_RAW.map((p) => ({
  ...p,
  meaning: l10n(["phonemes", "consonant", p.ipa, "meaning"]),
  note: l10n(["phonemes", "consonant", p.ipa, "note"]),
  trap: l10nOptional(["phonemes", "consonant", p.ipa, "trap"]),
}));

export interface VowelPhone {
  ipa: string;
  x: number;
  y: number;
  rounded: boolean;
  short: string;
  long: string;
  example: string;
  exampleIpa: string;
  meaning: L10n;
  approx: L10n;
}

const VOWEL_RAW: Omit<VowelPhone, "meaning" | "approx">[] = [
  { ipa: "i", x: 0, y: 0, rounded: false, short: "◌ิ", long: "◌ี", example: "ดี", exampleIpa: "diː" },
  { ipa: "ɯ", x: 0.78, y: 0, rounded: false, short: "◌ึ", long: "◌ือ", example: "มือ", exampleIpa: "mɯː" },
  { ipa: "u", x: 1, y: 0, rounded: true, short: "◌ุ", long: "◌ู", example: "ปู", exampleIpa: "puː" },
  { ipa: "e", x: 0.08, y: 0.33, rounded: false, short: "เ◌ะ", long: "เ◌", example: "เท", exampleIpa: "tʰeː" },
  { ipa: "ɤ", x: 0.8, y: 0.33, rounded: false, short: "เ◌อะ", long: "เ◌อ", example: "เธอ", exampleIpa: "tʰɤː" },
  { ipa: "o", x: 1, y: 0.33, rounded: true, short: "โ◌ะ", long: "โ◌", example: "โต", exampleIpa: "toː" },
  { ipa: "ɛ", x: 0.18, y: 0.66, rounded: false, short: "แ◌ะ", long: "แ◌", example: "แม่", exampleIpa: "mɛ̂ː" },
  { ipa: "ɔ", x: 1, y: 0.66, rounded: true, short: "เ◌าะ", long: "◌อ", example: "พ่อ", exampleIpa: "pʰɔ̂ː" },
  { ipa: "a", x: 0.5, y: 1, rounded: false, short: "◌ะ", long: "◌า", example: "มา", exampleIpa: "maː" },
];
export const VOWEL_PHONES: VowelPhone[] = VOWEL_RAW.map((p) => ({
  ...p,
  meaning: l10n(["phonemes", "vowel", p.ipa, "meaning"]),
  approx: l10n(["phonemes", "vowel", p.ipa, "approx"]),
}));

export const DIPHTHONGS = (
  [
    { ipa: "ia", thai: "เ◌ีย", example: "เมีย", exampleIpa: "mia", from: "i", to: "a" },
    { ipa: "ɯa", thai: "เ◌ือ", example: "เรือ", exampleIpa: "rɯa", from: "ɯ", to: "a" },
    { ipa: "ua", thai: "◌ัว", example: "วัว", exampleIpa: "wua", from: "u", to: "a" },
  ] as const
).map((p) => ({
  ...p,
  meaning: l10n(["phonemes", "diphthong", p.ipa, "meaning"]),
  approx: l10n(["phonemes", "diphthong", p.ipa, "approx"]),
}));

/** Bộ 5 thanh kinh điển với cùng khung kʰaː */
export const TONE_EXAMPLES = (
  [
    { tone: "mid", word: "คา", ipa: "kʰaː" },
    { tone: "low", word: "ข่า", ipa: "kʰàː" },
    { tone: "falling", word: "ค่า", ipa: "kʰâː" },
    { tone: "high", word: "ค้า", ipa: "kʰáː" },
    { tone: "rising", word: "ขา", ipa: "kʰǎː" },
  ] as const
).map((x) => ({ ...x, meaning: l10n(["phonemes", "toneExample", x.tone]) }));
