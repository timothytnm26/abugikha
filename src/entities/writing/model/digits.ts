import type { L10n } from "@/shared/i18n";

export interface ThaiDigit {
  char: string;
  value: number;
  word: string;
  ipa: string;
  meaning: L10n;
}

const d = (char: string, value: number, word: string, ipa: string): ThaiDigit => ({ char, value, word, ipa, meaning: { vi: String(value), en: String(value) } });

export const DIGITS: ThaiDigit[] = [
  d("๐", 0, "ศูนย์", "sǔːn"),
  d("๑", 1, "หนึ่ง", "nɯ̀ŋ"),
  d("๒", 2, "สอง", "sɔ̌ːŋ"),
  d("๓", 3, "สาม", "sǎːm"),
  d("๔", 4, "สี่", "sìː"),
  d("๕", 5, "ห้า", "hâː"),
  d("๖", 6, "หก", "hòk"),
  d("๗", 7, "เจ็ด", "tɕèt"),
  d("๘", 8, "แปด", "pɛ̀ːt"),
  d("๙", 9, "เก้า", "kâw"),
];
