import type { L10n } from "../i18n";

export type Place = "labial" | "alveolar" | "palatal" | "velar" | "glottal";
export type Manner = "unaspirated" | "aspirated" | "voiced" | "nasal" | "fricative" | "approximant" | "trill";

const L = (vi: string, en: string): L10n => ({ vi, en });

export const PLACES: { id: Place; label: L10n }[] = [
  { id: "labial", label: L("Môi", "Lips") },
  { id: "alveolar", label: L("Lợi", "Alveolar") },
  { id: "palatal", label: L("Vòm", "Palatal") },
  { id: "velar", label: L("Mạc", "Velar") },
  { id: "glottal", label: L("Thanh hầu", "Glottal") },
];
export const MANNERS: { id: Manner; label: L10n }[] = [
  { id: "unaspirated", label: L("Tắc, không bật hơi", "Stop, unaspirated") },
  { id: "aspirated", label: L("Tắc, bật hơi", "Stop, aspirated") },
  { id: "voiced", label: L("Tắc, hữu thanh", "Stop, voiced") },
  { id: "nasal", label: L("Mũi", "Nasal") },
  { id: "fricative", label: L("Xát", "Fricative") },
  { id: "approximant", label: L("Tiếp cận", "Approximant") },
  { id: "trill", label: L("Rung", "Trill") },
];

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

export const CONSONANT_PHONES: ConsonantPhone[] = [
  { ipa: "p", place: "labial", manner: "unaspirated", example: "ปลา", exampleIpa: "plaː", meaning: L("cá", "fish"), note: L("p không bật hơi, như “p” trong “pin”.", "Like p in “spin”: no puff of air.") },
  { ipa: "pʰ", place: "labial", manner: "aspirated", example: "พ่อ", exampleIpa: "pʰɔ̂ː", meaning: L("bố", "father"), note: L("p bật hơi mạnh; để tay trước miệng sẽ thấy luồng hơi.", "Like p in “pin”, with a strong puff of air."), trap: L("“ph” tiếng Việt là /f/. พ/ผ không phải /f/!", "Romanized “ph” is NOT “f”: พ/ผ are an aspirated p.") },
  { ipa: "b", place: "labial", manner: "voiced", example: "บ้าน", exampleIpa: "bâːn", meaning: L("nhà", "house"), note: L("Gần “b” tiếng Việt.", "Like b in “bee”.") },
  { ipa: "m", place: "labial", manner: "nasal", example: "แม่", exampleIpa: "mɛ̂ː", meaning: L("mẹ", "mother"), note: L("Như “m”.", "Like m.") },
  { ipa: "f", place: "labial", manner: "fricative", example: "ไฟ", exampleIpa: "faj", meaning: L("lửa", "fire"), note: L("Như “ph” tiếng Việt.", "Like f.") },
  { ipa: "w", place: "labial", manner: "approximant", example: "วัน", exampleIpa: "wan", meaning: L("ngày", "day"), note: L("Như “o/u” trong “hoa”, “qua”.", "Like w.") },
  { ipa: "t", place: "alveolar", manner: "unaspirated", example: "ตา", exampleIpa: "taː", meaning: L("mắt", "eye"), note: L("Như “t” tiếng Việt.", "Like t in “stop”: no puff of air."), trap: L("", "English speakers tend to aspirate it; keep it crisp and airless.") },
  { ipa: "tʰ", place: "alveolar", manner: "aspirated", example: "ที่", exampleIpa: "tʰîː", meaning: L("chỗ", "place"), note: L("Như “th” tiếng Việt.", "Like t in “top”, with a puff of air."), trap: L("", "Romanized “th” is NOT the “th” of “think”.") },
  { ipa: "d", place: "alveolar", manner: "voiced", example: "ดี", exampleIpa: "diː", meaning: L("tốt", "good"), note: L("Như “đ” tiếng Việt.", "Like d."), trap: L("Không phải “d” tiếng Việt (/z/ hoặc /j/).", "") },
  { ipa: "n", place: "alveolar", manner: "nasal", example: "น้ำ", exampleIpa: "náːm", meaning: L("nước", "water"), note: L("Như “n”.", "Like n.") },
  { ipa: "s", place: "alveolar", manner: "fricative", example: "สี", exampleIpa: "sǐː", meaning: L("màu", "color"), note: L("Như “x”.", "Like s.") },
  { ipa: "l", place: "alveolar", manner: "approximant", example: "ลม", exampleIpa: "lom", meaning: L("gió", "wind"), note: L("Như “l”.", "Like l.") },
  { ipa: "r", place: "alveolar", manner: "trill", example: "รถ", exampleIpa: "rót", meaning: L("xe", "car"), note: L("r rung đầu lưỡi. Khẩu ngữ hay đọc thành /l/.", "Rolled r. In casual speech often said as l.") },
  { ipa: "tɕ", place: "palatal", manner: "unaspirated", example: "ใจ", exampleIpa: "tɕaj", meaning: L("tim, lòng", "heart"), note: L("Gần “ch” tiếng Việt.", "Between j in “jam” and ch in “chip”, without air.") },
  { ipa: "tɕʰ", place: "palatal", manner: "aspirated", example: "ช้าง", exampleIpa: "tɕʰáːŋ", meaning: L("voi", "elephant"), note: L("“ch” bật hơi. Tiếng Việt không có âm này.", "Like ch in “chip”, with air.") },
  { ipa: "j", place: "palatal", manner: "approximant", example: "ยา", exampleIpa: "jaː", meaning: L("thuốc", "medicine"), note: L("Như “d/gi” giọng miền Nam.", "Like y in “yes”.") },
  { ipa: "k", place: "velar", manner: "unaspirated", example: "กา", exampleIpa: "kaː", meaning: L("con quạ", "crow"), note: L("Như “c/k”.", "Like k in “skin”: no puff of air.") },
  { ipa: "kʰ", place: "velar", manner: "aspirated", example: "คน", exampleIpa: "kʰon", meaning: L("người", "person"), note: L("“k” bật hơi.", "Like k in “kin”, with a puff of air."), trap: L("“kh” tiếng Việt là âm xát /x/. ข/ค là k + luồng hơi, không cọ xát.", "") },
  { ipa: "ŋ", place: "velar", manner: "nasal", example: "งู", exampleIpa: "ŋuː", meaning: L("rắn", "snake"), note: L("Như “ng” – người Việt có lợi thế vì âm này khó với người Âu.", "The ng of “sing”, but at the start of a word."), trap: L("", "Practice saying “singing” and drop the “si-”.") },
  { ipa: "ʔ", place: "glottal", manner: "unaspirated", example: "อ่าน", exampleIpa: "ʔàːn", meaning: L("đọc", "to read"), note: L("Tắc thanh hầu, như cách mở đầu từ “ăn”.", "The catch in “uh-oh”.") },
  { ipa: "h", place: "glottal", manner: "fricative", example: "หา", exampleIpa: "hǎː", meaning: L("tìm", "to look for"), note: L("Như “h”.", "Like h.") },
];

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

export const VOWEL_PHONES: VowelPhone[] = [
  { ipa: "i", x: 0, y: 0, rounded: false, short: "◌ิ", long: "◌ี", example: "ดี", exampleIpa: "diː", meaning: L("tốt", "good"), approx: L("i", "ee in “see”") },
  { ipa: "ɯ", x: 0.78, y: 0, rounded: false, short: "◌ึ", long: "◌ือ", example: "มือ", exampleIpa: "mɯː", meaning: L("tay", "hand"), approx: L("ư", "“oo” with spread lips") },
  { ipa: "u", x: 1, y: 0, rounded: true, short: "◌ุ", long: "◌ู", example: "ปู", exampleIpa: "puː", meaning: L("cua", "crab"), approx: L("u", "oo in “food”") },
  { ipa: "e", x: 0.08, y: 0.33, rounded: false, short: "เ◌ะ", long: "เ◌", example: "เท", exampleIpa: "tʰeː", meaning: L("đổ", "to pour"), approx: L("ê", "a in “gate”, no glide") },
  { ipa: "ɤ", x: 0.8, y: 0.33, rounded: false, short: "เ◌อะ", long: "เ◌อ", example: "เธอ", exampleIpa: "tʰɤː", meaning: L("em, cô ấy", "you, she"), approx: L("ơ", "ir in British “bird”") },
  { ipa: "o", x: 1, y: 0.33, rounded: true, short: "โ◌ะ", long: "โ◌", example: "โต", exampleIpa: "toː", meaning: L("to lớn", "big"), approx: L("ô", "o in “go”, no glide") },
  { ipa: "ɛ", x: 0.18, y: 0.66, rounded: false, short: "แ◌ะ", long: "แ◌", example: "แม่", exampleIpa: "mɛ̂ː", meaning: L("mẹ", "mother"), approx: L("e", "a in “cat”") },
  { ipa: "ɔ", x: 1, y: 0.66, rounded: true, short: "เ◌าะ", long: "◌อ", example: "พ่อ", exampleIpa: "pʰɔ̂ː", meaning: L("bố", "father"), approx: L("o", "aw in “law”") },
  { ipa: "a", x: 0.5, y: 1, rounded: false, short: "◌ะ", long: "◌า", example: "มา", exampleIpa: "maː", meaning: L("đến", "to come"), approx: L("ă (ngắn) / a (dài)", "u in “cut” / a in “father”") },
];

export const DIPHTHONGS = [
  { ipa: "ia", thai: "เ◌ีย", example: "เมีย", exampleIpa: "mia", meaning: L("vợ", "wife"), from: "i", to: "a", approx: L("iê / ia", "ea in “idea”") },
  { ipa: "ɯa", thai: "เ◌ือ", example: "เรือ", exampleIpa: "rɯa", meaning: L("thuyền", "boat"), from: "ɯ", to: "a", approx: L("ươ / ưa", "spread-lip “oo” + a") },
  { ipa: "ua", thai: "◌ัว", example: "วัว", exampleIpa: "wua", meaning: L("bò", "cow"), from: "u", to: "a", approx: L("uô / ua", "ua in “truant”") },
];

/** Bộ 5 thanh kinh điển với cùng khung kʰaː */
export const TONE_EXAMPLES = [
  { tone: "mid", word: "คา", ipa: "kʰaː", meaning: L("mắc kẹt", "stuck") },
  { tone: "low", word: "ข่า", ipa: "kʰàː", meaning: L("củ riềng", "galangal") },
  { tone: "falling", word: "ค่า", ipa: "kʰâː", meaning: L("giá trị", "value") },
  { tone: "high", word: "ค้า", ipa: "kʰáː", meaning: L("buôn bán", "to trade") },
  { tone: "rising", word: "ขา", ipa: "kʰǎː", meaning: L("cái chân", "leg") },
] as const;
