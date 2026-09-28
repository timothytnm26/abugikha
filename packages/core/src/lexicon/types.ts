import type { L10n } from "../i18n";

export interface Word {
  thai: string;
  /** IPA, các âm tiết cách nhau bằng dấu chấm */
  ipa: string;
  meaning: L10n;
  /** Các âm tiết (theo chính tả) của từ ghép; bỏ trống nếu là từ đơn */
  parts?: string[];
}
