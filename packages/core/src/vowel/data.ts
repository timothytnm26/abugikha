import { l10n, l10nOptional } from "@abugikha/i18n";
import type { Vowel, VowelPlacement } from "./types";

/** Cách đọc gần đúng và ghi chú dạng đóng nằm ở locales/<locale>/vowels.json, khoá là id */
const v = (x: Omit<Vowel, "approx" | "closedNote">): Vowel => ({
  ...x,
  approx: l10n(["vowels", "approx", x.id]),
  closedNote: l10nOptional(["vowels", "closedNote", x.id]),
});

export const VOWELS: Vowel[] = [
  v({ id: "a", open: "Cะ", closed: "CัF", excludeFinals: ["ว"], ipa: "a", length: "short", kind: "mono" }),
  v({ id: "aa", open: "Cา", closed: "CาF", ipa: "aː", length: "long", kind: "mono" }),
  v({ id: "i", open: "Cิ", closed: "CิF", ipa: "i", length: "short", kind: "mono" }),
  v({ id: "ii", open: "Cี", closed: "CีF", ipa: "iː", length: "long", kind: "mono" }),
  v({ id: "ue", open: "Cึ", closed: "CึF", ipa: "ɯ", length: "short", kind: "mono" }),
  v({ id: "uue", open: "Cือ", closed: "CืF", ipa: "ɯː", length: "long", kind: "mono" }),
  v({ id: "u", open: "Cุ", closed: "CุF", ipa: "u", length: "short", kind: "mono" }),
  v({ id: "uu", open: "Cู", closed: "CูF", ipa: "uː", length: "long", kind: "mono" }),
  v({ id: "e", open: "เCะ", closed: "เC็F", ipa: "e", length: "short", kind: "mono" }),
  v({ id: "ee", open: "เC", closed: "เCF", ipa: "eː", length: "long", kind: "mono" }),
  v({ id: "ae", open: "แCะ", closed: "แC็F", ipa: "ɛ", length: "short", kind: "mono" }),
  v({ id: "aae", open: "แC", closed: "แCF", ipa: "ɛː", length: "long", kind: "mono" }),
  v({ id: "o", open: "โCะ", closed: "CF", excludeFinals: ["ว"], ipa: "o", length: "short", kind: "mono" }),
  v({ id: "oo", open: "โC", closed: "โCF", ipa: "oː", length: "long", kind: "mono" }),
  v({ id: "or", open: "เCาะ", closed: "C็อF", ipa: "ɔ", length: "short", kind: "mono" }),
  v({ id: "oor", open: "Cอ", closed: "CอF", ipa: "ɔː", length: "long", kind: "mono" }),
  v({ id: "oe", open: "เCอะ", closed: null, ipa: "ɤ", length: "short", kind: "mono" }),
  v({ id: "ooe", open: "เCอ", closed: "เCิF", closedBy: { ย: "เCF" }, ipa: "ɤː", length: "long", kind: "mono" }),
  v({ id: "ia", open: "เCียะ", closed: null, ipa: "ia", length: "short", kind: "diph" }),
  v({ id: "iia", open: "เCีย", closed: "เCียF", ipa: "ia", length: "long", kind: "diph" }),
  v({ id: "uea", open: "เCือะ", closed: null, ipa: "ɯa", length: "short", kind: "diph" }),
  v({ id: "uuea", open: "เCือ", closed: "เCือF", ipa: "ɯa", length: "long", kind: "diph" }),
  v({ id: "ua", noWCluster: true, open: "Cัวะ", closed: null, ipa: "ua", length: "short", kind: "diph" }),
  v({ id: "uua", noWCluster: true, open: "Cัว", closed: "CวF", ipa: "ua", length: "long", kind: "diph" }),
  v({ id: "am", open: "Cำ", closed: null, ipa: "am", length: "short", kind: "special", alwaysLive: true }),
  v({ id: "ai-muan", open: "ใC", closed: null, ipa: "aj", length: "short", kind: "special", alwaysLive: true }),
  v({ id: "ai-malai", open: "ไC", closed: null, ipa: "aj", length: "short", kind: "special", alwaysLive: true }),
  v({ id: "ao", open: "เCา", closed: null, ipa: "aw", length: "short", kind: "special", alwaysLive: true }),
];

export const VOWEL_BY_ID = new Map(VOWELS.map((x) => [x.id, x]));

/** Mẫu viết khi có âm cuối `final` (null nếu nguyên âm không nhận âm cuối) */
export const closedPattern = (x: Vowel, final?: string | null) => (final && x.closedBy?.[final]) || x.closed;

export type VowelGroup = "short" | "long" | "diph" | "special";
export const VOWEL_GROUPS: VowelGroup[] = ["short", "long", "diph", "special"];
/** Nhóm hiển thị: nguyên âm đơn ngắn / dài, nguyên âm ghép (đôi), nguyên âm đặc biệt (tự mang âm cuối) */
export const vowelGroup = (x: Vowel): VowelGroup =>
  x.kind === "special" ? "special" : x.kind === "diph" ? "diph" : x.length === "long" ? "long" : "short";

/** Hình hiển thị với vòng tròn giữ chỗ ◌ */
export const vowelGlyph = (x: Vowel, form: "open" | "closed" = "open", holder = "◌") =>
  (form === "closed" && x.closed ? x.closed : x.open).replace("C", holder).replace("F", holder);

/** Nguyên âm được viết ở những phía nào của phụ âm đầu */
export function vowelPlacements(pattern: string): VowelPlacement[] {
  const [head, tail = ""] = pattern.split("C");
  const set = new Set<VowelPlacement>();
  if (head) set.add("before");
  if (/[ัิีึื็ำ]/.test(tail)) set.add("above");
  if (/[ุู]/.test(tail)) set.add("below");
  if (/[ะาอยวำ]/.test(tail.replace("F", ""))) set.add("after");
  return [...set];
}

/** Cụm phụ âm đầu kết thúc bằng ว (กว, ขว, คว) */
export const isWCluster = (chars: string) => chars.length > 1 && chars.endsWith("ว") && !chars.startsWith("ห");
/** Nguyên âm có đi được với phụ âm đầu này không */
export const vowelFitsInitial = (v: Vowel, chars: string) => !(v.noWCluster && isWCluster(chars));
