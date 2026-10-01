import type { ToneMarkId } from "@/entities/syllable";

export interface SyllableExample {
  word: string;
  initialId: string;
  vowelId: string;
  finalId: string | null;
  mark: ToneMarkId | null;
}

/** Ví dụ mẫu: cùng nguyên âm /aː/, ba nhóm phụ âm cho ba thanh khác nhau, rồi một dấu thanh. Dùng ở khung gợi ý của /lab và ở cuối trang chủ. */
export const SYLLABLE_EXAMPLES: SyllableExample[] = [
  { word: "กา", initialId: "ก", vowelId: "aa", finalId: null, mark: null },
  { word: "ขา", initialId: "ข", vowelId: "aa", finalId: null, mark: null },
  { word: "คา", initialId: "ค", vowelId: "aa", finalId: null, mark: null },
  { word: "ค่า", initialId: "ค", vowelId: "aa", finalId: null, mark: "ek" },
];
