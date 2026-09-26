import type { L10n } from "@/shared/i18n";

export type ConsonantClass = "mid" | "high" | "low";
export type FinalSound = "k" | "t" | "p" | "m" | "n" | "ŋ" | "j" | "w";

export interface Consonant {
  id: string;
  char: string;
  /** Tên phiên âm Latin, vd. "ko kai" */
  name: string;
  /** Từ khoá gắn với tên chữ, vd. ไก่ */
  word: string;
  meaning: L10n;
  cls: ConsonantClass;
  /** Âm đầu (IPA) */
  initial: string;
  /** Âm khi đứng cuối; null = không dùng làm phụ âm cuối */
  final: FinalSound | null;
  sonorant: boolean;
  common: boolean;
  obsolete?: boolean;
}

/**
 * Một "đơn vị phụ âm đầu": chữ đơn, phụ âm ghép (ควบกล้ำ), ghép không thật (ควบไม่แท้)
 * hoặc chữ nhấn (อักษรนำ, vd. หน). Nhóm của cả đơn vị là nhóm của chữ đứng đầu.
 */
export type InitialKind = "single" | "cluster" | "false-cluster" | "leading";
export interface InitialUnit {
  id: string;
  chars: string;
  ipa: string;
  cls: ConsonantClass;
  kind: InitialKind;
  /** Chữ quyết định nhóm */
  head: string;
  common: boolean;
  note?: L10n;
}
