import type { L10n } from "../i18n";

export type VowelLength = "short" | "long";
export type VowelPlacement = "before" | "above" | "below" | "after";

export interface Vowel {
  id: string;
  /** Mẫu viết khi không có phụ âm cuối. C = vị trí phụ âm đầu */
  open: string;
  /** Mẫu khi có phụ âm cuối (F). null = không đi với phụ âm cuối */
  closed: string | null;
  ipa: string;
  length: VowelLength;
  kind: "mono" | "diph" | "special";
  /** ำ ใ ไ เา: tự mang âm cuối nên luôn là âm tiết sống */
  alwaysLive?: boolean;
  /** Âm gần nhất trong tiếng Việt / tiếng Anh */
  approx: L10n;
  /** Nguyên âm đổi dạng khi có phụ âm cuối */
  closedNote?: L10n;
  /** Âm cuối không kết hợp được theo chính tả (vd. ◌ั + ว viết thành เ-า) */
  excludeFinals?: string[];
  /** /ua/ không đi sau cụm có ว (กว ขว คว): /kw/ + /ua/ không tồn tại */
  noWCluster?: boolean;
}
