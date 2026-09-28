import type { Consonant, ConsonantClass, FinalSound } from "./types";

const SONORANTS = new Set(["ง", "ญ", "ณ", "น", "ม", "ย", "ร", "ล", "ว", "ฬ"]);
const COMMON = new Set("กขคงจฉชซดตถทนบปผฝพฟมยรลวสหอฮญ".split(""));

const c = (
  char: string, name: string, word: string, vi: string, en: string,
  cls: ConsonantClass, initial: string, final: FinalSound | null, obsolete = false,
): Consonant => ({
  id: char, char, name, word, meaning: { vi, en }, cls, initial, final, obsolete,
  sonorant: SONORANTS.has(char),
  common: COMMON.has(char),
});

/** 44 phụ âm theo thứ tự bảng chữ cái (ฃ, ฅ đã lỗi thời). */
export const CONSONANTS: Consonant[] = [
  c("ก", "ko kai", "ไก่", "con gà", "chicken", "mid", "k", "k"),
  c("ข", "kho khai", "ไข่", "quả trứng", "egg", "high", "kʰ", "k"),
  c("ฃ", "kho khuat", "ขวด", "cái chai", "bottle", "high", "kʰ", "k", true),
  c("ค", "kho khwai", "ควาย", "con trâu", "buffalo", "low", "kʰ", "k"),
  c("ฅ", "kho khon", "คน", "con người", "person", "low", "kʰ", "k", true),
  c("ฆ", "kho rakhang", "ระฆัง", "cái chuông", "bell", "low", "kʰ", "k"),
  c("ง", "ngo ngu", "งู", "con rắn", "snake", "low", "ŋ", "ŋ"),
  c("จ", "cho chan", "จาน", "cái đĩa", "plate", "mid", "tɕ", "t"),
  c("ฉ", "cho ching", "ฉิ่ง", "chũm chọe nhỏ", "small cymbals", "high", "tɕʰ", null),
  c("ช", "cho chang", "ช้าง", "con voi", "elephant", "low", "tɕʰ", "t"),
  c("ซ", "so so", "โซ่", "sợi xích", "chain", "low", "s", "t"),
  c("ฌ", "cho choe", "เฌอ", "cái cây", "tree", "low", "tɕʰ", null),
  c("ญ", "yo ying", "หญิง", "phụ nữ", "woman", "low", "j", "n"),
  c("ฎ", "do chada", "ชฎา", "mũ chada", "chada headdress", "mid", "d", "t"),
  c("ฏ", "to patak", "ปฏัก", "gậy thúc voi", "goad", "mid", "t", "t"),
  c("ฐ", "tho than", "ฐาน", "cái bệ", "pedestal", "high", "tʰ", "t"),
  c("ฑ", "tho nangmontho", "มณโฑ", "nàng Montho", "Montho (a character)", "low", "tʰ", "t"),
  c("ฒ", "tho phuthao", "ผู้เฒ่า", "ông lão", "elder", "low", "tʰ", "t"),
  c("ณ", "no nen", "เณร", "chú tiểu", "novice monk", "low", "n", "n"),
  c("ด", "do dek", "เด็ก", "đứa trẻ", "child", "mid", "d", "t"),
  c("ต", "to tao", "เต่า", "con rùa", "turtle", "mid", "t", "t"),
  c("ถ", "tho thung", "ถุง", "cái túi", "bag", "high", "tʰ", "t"),
  c("ท", "tho thahan", "ทหาร", "người lính", "soldier", "low", "tʰ", "t"),
  c("ธ", "tho thong", "ธง", "lá cờ", "flag", "low", "tʰ", "t"),
  c("น", "no nu", "หนู", "con chuột", "mouse", "low", "n", "n"),
  c("บ", "bo baimai", "ใบไม้", "chiếc lá", "leaf", "mid", "b", "p"),
  c("ป", "po pla", "ปลา", "con cá", "fish", "mid", "p", "p"),
  c("ผ", "pho phueng", "ผึ้ง", "con ong", "bee", "high", "pʰ", null),
  c("ฝ", "fo fa", "ฝา", "cái nắp", "lid", "high", "f", null),
  c("พ", "pho phan", "พาน", "cái khay", "offering tray", "low", "pʰ", "p"),
  c("ฟ", "fo fan", "ฟัน", "cái răng", "tooth", "low", "f", "p"),
  c("ภ", "pho samphao", "สำเภา", "thuyền buồm", "junk (ship)", "low", "pʰ", "p"),
  c("ม", "mo ma", "ม้า", "con ngựa", "horse", "low", "m", "m"),
  c("ย", "yo yak", "ยักษ์", "chằn tinh", "giant", "low", "j", "j"),
  c("ร", "ro ruea", "เรือ", "con thuyền", "boat", "low", "r", "n"),
  c("ล", "lo ling", "ลิง", "con khỉ", "monkey", "low", "l", "n"),
  c("ว", "wo waen", "แหวน", "chiếc nhẫn", "ring", "low", "w", "w"),
  c("ศ", "so sala", "ศาลา", "cái đình", "pavilion", "high", "s", "t"),
  c("ษ", "so ruesi", "ฤๅษี", "ẩn sĩ", "hermit", "high", "s", "t"),
  c("ส", "so suea", "เสือ", "con hổ", "tiger", "high", "s", "t"),
  c("ห", "ho hip", "หีบ", "cái rương", "chest", "high", "h", null),
  c("ฬ", "lo chula", "จุฬา", "con diều", "kite", "low", "l", "n"),
  c("อ", "o ang", "อ่าง", "cái chậu", "basin", "mid", "ʔ", null),
  c("ฮ", "ho nokhuk", "นกฮูก", "con cú", "owl", "low", "h", null),
];

export const CONSONANT_BY_ID = new Map(CONSONANTS.map((x) => [x.id, x]));

/** Chuỗi để TTS đọc tên chữ, vd. "กอ ไก่". */
export const consonantSpeech = (x: Consonant) => `${x.char}อ ${x.word}`;
