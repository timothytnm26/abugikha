import { l10n } from "@abugikha/i18n";
import type { Consonant, ConsonantClass, FinalSound } from "./types";

const SONORANTS = new Set(["ง", "ญ", "ณ", "น", "ม", "ย", "ร", "ล", "ว", "ฬ"]);
const COMMON = new Set("กขคงจฉชซดตถทนบปผฝพฟมยรลวสหอฮญ".split(""));

const c = (
  char: string, name: string, word: string,
  cls: ConsonantClass, initial: string, final: FinalSound | null, obsolete = false,
): Consonant => ({
  id: char, char, name, word, meaning: l10n(["consonants", "meaning", char]), cls, initial, final, obsolete,
  sonorant: SONORANTS.has(char),
  common: COMMON.has(char),
});

/** 44 phụ âm theo thứ tự truyền thống của chữ Thái (ฃ, ฅ đã lỗi thời). */
export const CONSONANTS: Consonant[] = [
  c("ก", "ko kai", "ไก่", "mid", "k", "k"),
  c("ข", "kho khai", "ไข่", "high", "kʰ", "k"),
  c("ฃ", "kho khuat", "ขวด", "high", "kʰ", "k", true),
  c("ค", "kho khwai", "ควาย", "low", "kʰ", "k"),
  c("ฅ", "kho khon", "คน", "low", "kʰ", "k", true),
  c("ฆ", "kho rakhang", "ระฆัง", "low", "kʰ", "k"),
  c("ง", "ngo ngu", "งู", "low", "ŋ", "ŋ"),
  c("จ", "cho chan", "จาน", "mid", "tɕ", "t"),
  c("ฉ", "cho ching", "ฉิ่ง", "high", "tɕʰ", null),
  c("ช", "cho chang", "ช้าง", "low", "tɕʰ", "t"),
  c("ซ", "so so", "โซ่", "low", "s", "t"),
  c("ฌ", "cho choe", "เฌอ", "low", "tɕʰ", null),
  c("ญ", "yo ying", "หญิง", "low", "j", "n"),
  c("ฎ", "do chada", "ชฎา", "mid", "d", "t"),
  c("ฏ", "to patak", "ปฏัก", "mid", "t", "t"),
  c("ฐ", "tho than", "ฐาน", "high", "tʰ", "t"),
  c("ฑ", "tho nangmontho", "มณโฑ", "low", "tʰ", "t"),
  c("ฒ", "tho phuthao", "ผู้เฒ่า", "low", "tʰ", "t"),
  c("ณ", "no nen", "เณร", "low", "n", "n"),
  c("ด", "do dek", "เด็ก", "mid", "d", "t"),
  c("ต", "to tao", "เต่า", "mid", "t", "t"),
  c("ถ", "tho thung", "ถุง", "high", "tʰ", "t"),
  c("ท", "tho thahan", "ทหาร", "low", "tʰ", "t"),
  c("ธ", "tho thong", "ธง", "low", "tʰ", "t"),
  c("น", "no nu", "หนู", "low", "n", "n"),
  c("บ", "bo baimai", "ใบไม้", "mid", "b", "p"),
  c("ป", "po pla", "ปลา", "mid", "p", "p"),
  c("ผ", "pho phueng", "ผึ้ง", "high", "pʰ", null),
  c("ฝ", "fo fa", "ฝา", "high", "f", null),
  c("พ", "pho phan", "พาน", "low", "pʰ", "p"),
  c("ฟ", "fo fan", "ฟัน", "low", "f", "p"),
  c("ภ", "pho samphao", "สำเภา", "low", "pʰ", "p"),
  c("ม", "mo ma", "ม้า", "low", "m", "m"),
  c("ย", "yo yak", "ยักษ์", "low", "j", "j"),
  c("ร", "ro ruea", "เรือ", "low", "r", "n"),
  c("ล", "lo ling", "ลิง", "low", "l", "n"),
  c("ว", "wo waen", "แหวน", "low", "w", "w"),
  c("ศ", "so sala", "ศาลา", "high", "s", "t"),
  c("ษ", "so ruesi", "ฤๅษี", "high", "s", "t"),
  c("ส", "so suea", "เสือ", "high", "s", "t"),
  c("ห", "ho hip", "หีบ", "high", "h", null),
  c("ฬ", "lo chula", "จุฬา", "low", "l", "n"),
  c("อ", "o ang", "อ่าง", "mid", "ʔ", null),
  c("ฮ", "ho nokhuk", "นกฮูก", "low", "h", null),
];

export const CONSONANT_BY_ID = new Map(CONSONANTS.map((x) => [x.id, x]));

/** Chuỗi để TTS đọc tên chữ, vd. "กอ ไก่". */
export const consonantSpeech = (x: Consonant) => `${x.char}อ ${x.word}`;
