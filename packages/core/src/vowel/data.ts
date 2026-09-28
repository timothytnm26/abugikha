import type { Vowel, VowelPlacement } from "./types";

type Raw = Omit<Vowel, "approx" | "closedNote"> & { vi: string; en: string; noteVi?: string; noteEn?: string };
const v = ({ vi, en, noteVi, noteEn, ...x }: Raw): Vowel => ({
  ...x,
  approx: { vi, en },
  closedNote: noteVi ? { vi: noteVi, en: noteEn! } : undefined,
});

export const VOWELS: Vowel[] = [
  v({ id: "a", open: "Cะ", closed: "CัF", excludeFinals: ["ว"], ipa: "a", length: "short", kind: "mono", vi: "ă", en: "u in “cut”",
      noteVi: "ะ đổi thành dấu ◌ั (mái hăn-a-kát) đặt trên phụ âm đầu: ก + ะ + น → กัน",
      noteEn: "ะ becomes ◌ั (mai han-akat) above the initial: ก + ะ + น → กัน" }),
  v({ id: "aa", open: "Cา", closed: "CาF", ipa: "aː", length: "long", kind: "mono", vi: "a", en: "a in “father”" }),
  v({ id: "i", open: "Cิ", closed: "CิF", ipa: "i", length: "short", kind: "mono", vi: "i (ngắn)", en: "i in “bit”" }),
  v({ id: "ii", open: "Cี", closed: "CีF", ipa: "iː", length: "long", kind: "mono", vi: "i (dài)", en: "ee in “see”" }),
  v({ id: "ue", open: "Cึ", closed: "CึF", ipa: "ɯ", length: "short", kind: "mono", vi: "ư (ngắn)", en: "“oo” with spread lips (short)" }),
  v({ id: "uue", open: "Cือ", closed: "CืF", ipa: "ɯː", length: "long", kind: "mono", vi: "ư (dài)", en: "“oo” with spread lips (long)",
      noteVi: "Khi có phụ âm cuối thì bỏ อ: ค + ือ + น → คืน", noteEn: "With a final, อ is dropped: ค + ือ + น → คืน" }),
  v({ id: "u", open: "Cุ", closed: "CุF", ipa: "u", length: "short", kind: "mono", vi: "u (ngắn)", en: "u in “put”" }),
  v({ id: "uu", open: "Cู", closed: "CูF", ipa: "uː", length: "long", kind: "mono", vi: "u (dài)", en: "oo in “food”" }),
  v({ id: "e", open: "เCะ", closed: "เC็F", ipa: "e", length: "short", kind: "mono", vi: "ê", en: "e in “bet”, tenser",
      noteVi: "ะ đổi thành dấu ◌็ (mái tai-khu): เ + ล + ะ + ก → เล็ก", noteEn: "ะ becomes ◌็ (mai taikhu): เ + ล + ะ + ก → เล็ก" }),
  v({ id: "ee", open: "เC", closed: "เCF", ipa: "eː", length: "long", kind: "mono", vi: "ê (dài)", en: "a in “gate”, no glide" }),
  v({ id: "ae", open: "แCะ", closed: "แC็F", ipa: "ɛ", length: "short", kind: "mono", vi: "e", en: "a in “cat” (short)",
      noteVi: "ะ đổi thành dấu ◌็: แ + ข + ะ + ง → แข็ง", noteEn: "ะ becomes ◌็: แ + ข + ะ + ง → แข็ง" }),
  v({ id: "aae", open: "แC", closed: "แCF", ipa: "ɛː", length: "long", kind: "mono", vi: "e (dài)", en: "a in “cat” (long)" }),
  v({ id: "o", open: "โCะ", closed: "CF", excludeFinals: ["ว"], ipa: "o", length: "short", kind: "mono", vi: "ô", en: "o in “go”, short, no glide",
      noteVi: "Nguyên âm biến mất khỏi mặt chữ: ก + น → กน /kon/ (nguyên âm ẩn)", noteEn: "The vowel disappears from writing: ก + น → กน /kon/ (hidden vowel)" }),
  v({ id: "oo", open: "โC", closed: "โCF", ipa: "oː", length: "long", kind: "mono", vi: "ô (dài)", en: "o in “go”, no glide" }),
  v({ id: "or", open: "เCาะ", closed: "C็อF", ipa: "ɔ", length: "short", kind: "mono", vi: "o", en: "o in British “hot”",
      noteVi: "เ-าะ đổi thành ◌็อ: ล็อก (hiếm, chủ yếu từ mượn)", noteEn: "เ-าะ becomes ◌็อ: ล็อก (rare, mostly loanwords)" }),
  v({ id: "oor", open: "Cอ", closed: "CอF", ipa: "ɔː", length: "long", kind: "mono", vi: "o (dài)", en: "aw in “law”" }),
  v({ id: "oe", open: "เCอะ", closed: null, ipa: "ɤ", length: "short", kind: "mono", vi: "ơ (ngắn)", en: "u in “hurt”, short" }),
  v({ id: "ooe", open: "เCอ", closed: "เCิF", ipa: "ɤː", length: "long", kind: "mono", vi: "ơ", en: "ir in British “bird”",
      noteVi: "อ đổi thành ◌ิ: เ + ด + อ + น → เดิน. Riêng cuối ย viết เ-ย: เลย", noteEn: "อ becomes ◌ิ: เ + ด + อ + น → เดิน. Before ย it is written เ-ย: เลย" }),
  v({ id: "ia", open: "เCียะ", closed: null, ipa: "ia", length: "short", kind: "diph", vi: "iê (ngắn)", en: "ia in “Maria”, short" }),
  v({ id: "iia", open: "เCีย", closed: "เCียF", ipa: "ia", length: "long", kind: "diph", vi: "iê / ia", en: "ea in “idea”" }),
  v({ id: "uea", open: "เCือะ", closed: null, ipa: "ɯa", length: "short", kind: "diph", vi: "ươ (ngắn)", en: "spread-lip “oo” + a, short" }),
  v({ id: "uuea", open: "เCือ", closed: "เCือF", ipa: "ɯa", length: "long", kind: "diph", vi: "ươ / ưa", en: "spread-lip “oo” gliding to a" }),
  v({ id: "ua", noWCluster: true, open: "Cัวะ", closed: null, ipa: "ua", length: "short", kind: "diph", vi: "uô (ngắn)", en: "ua in “truant”, short" }),
  v({ id: "uua", noWCluster: true, open: "Cัว", closed: "CวF", ipa: "ua", length: "long", kind: "diph", vi: "uô / ua", en: "ua in “truant”",
      noteVi: "Dấu ◌ั bị lược bỏ: ค + ัว + น → ควร, ส + ัว + น → สวน", noteEn: "◌ั is dropped: ค + ัว + น → ควร, ส + ัว + น → สวน" }),
  v({ id: "am", open: "Cำ", closed: null, ipa: "am", length: "short", kind: "special", alwaysLive: true, vi: "ăm", en: "um in “rum”" }),
  v({ id: "ai-muan", open: "ใC", closed: null, ipa: "aj", length: "short", kind: "special", alwaysLive: true, vi: "ay (chỉ ~20 từ)", en: "i in “bite” (only ~20 words)" }),
  v({ id: "ai-malai", open: "ไC", closed: null, ipa: "aj", length: "short", kind: "special", alwaysLive: true, vi: "ay", en: "i in “bite”" }),
  v({ id: "ao", open: "เCา", closed: null, ipa: "aw", length: "short", kind: "special", alwaysLive: true, vi: "au", en: "ow in “cow”" }),
];

export const VOWEL_BY_ID = new Map(VOWELS.map((x) => [x.id, x]));

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
