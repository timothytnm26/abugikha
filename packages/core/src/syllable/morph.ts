import type { L10n, Locale } from "../i18n";
import { CONSONANT_BY_ID, INITIAL_BY_ID } from "../consonant";
import { VOWEL_BY_ID } from "../vowel";
import { analyzeSyllable } from "./analyze";
import type { ToneMarkId } from "./tone";
import type { SegmentRole, SyllableAnalysis } from "./types";

/**
 * Nguyên âm "biến hình": cùng một nguyên âm nhưng đổi cách viết khi có phụ âm cuối
 * (hoặc khi có dấu thanh). Mỗi quy tắc chỉ khai báo ví dụ; hai dạng chữ được ghép bằng
 * analyzeSyllable nên luôn khớp với trang Ghép chữ.
 */
export type MorphGroup = "short" | "long" | "compound" | "tone";
export const MORPH_GROUPS: MorphGroup[] = ["short", "long", "compound", "tone"];

export interface MorphRule {
  id: string;
  group: MorphGroup;
  vowelId: string;
  /** id trong INITIAL_UNITS */
  initial: string;
  /** id phụ âm cuối */
  final: string;
  /** Chỉ cho quy tắc dấu thanh: dạng sau có thêm dấu này */
  mark?: ToneMarkId;
  /** Tóm tắt một dòng */
  summary: L10n;
  /** Giải thích; mặc định lấy closedNote của nguyên âm */
  rule?: L10n;
}

export const MORPH_RULES: MorphRule[] = [
  { id: "a", group: "short", vowelId: "a", initial: "ว", final: "น", summary: { vi: "ะ nhường chỗ cho ◌ั", en: "ะ gives way to ◌ั" } },
  { id: "e", group: "short", vowelId: "e", initial: "ต", final: "ม", summary: { vi: "ะ đổi thành ◌็", en: "ะ becomes ◌็" } },
  { id: "ae", group: "short", vowelId: "ae", initial: "ข", final: "ง", summary: { vi: "ะ đổi thành ◌็", en: "ะ becomes ◌็" } },
  { id: "o", group: "short", vowelId: "o", initial: "ค", final: "น", summary: { vi: "Nguyên âm biến mất", en: "The vowel disappears" } },
  { id: "or", group: "short", vowelId: "or", initial: "ล", final: "ก", summary: { vi: "Ba mảnh còn hai", en: "Three pieces become two" } },
  { id: "uue", group: "long", vowelId: "uue", initial: "ม", final: "ด", summary: { vi: "อ rơi mất", en: "อ drops" } },
  { id: "ooe", group: "long", vowelId: "ooe", initial: "ด", final: "น", summary: { vi: "อ đổi thành ◌ิ", en: "อ becomes ◌ิ" } },
  {
    id: "ooe-y", group: "long", vowelId: "ooe", initial: "ล", final: "ย",
    summary: { vi: "Gặp ย: อ biến mất", en: "Before ย: อ vanishes" },
    rule: {
      vi: "Riêng khi âm cuối là ย, อ biến mất và ย đứng ngay chỗ đó, không cần ◌ิ: เ + ล + อ + ย → เลย.",
      en: "When the final is ย, อ disappears and ย takes its place with no ◌ิ: เ + ล + อ + ย → เลย.",
    },
  },
  {
    id: "iia", group: "compound", vowelId: "iia", initial: "ร", final: "น",
    summary: { vi: "Giữ nguyên, thêm âm cuối", en: "Unchanged, final added" },
    rule: {
      vi: "Nguyên âm ghép /ia/ gồm ba mảnh: เ trước, ◌ี trên và ย sau. Khi có âm cuối, cả ba mảnh giữ nguyên, âm cuối đứng sau ย.",
      en: "The compound vowel /ia/ has three pieces: เ before, ◌ี above and ย after. With a final, all three stay and the final follows ย.",
    },
  },
  {
    id: "uuea", group: "compound", vowelId: "uuea", initial: "ร", final: "น",
    summary: { vi: "Giữ nguyên, thêm âm cuối", en: "Unchanged, final added" },
    rule: {
      vi: "Nguyên âm ghép /ɯa/ gồm เ trước, ◌ื trên và อ sau. Khác với ◌ือ đơn, อ ở đây không rơi khi có âm cuối.",
      en: "The compound vowel /ɯa/ is เ before, ◌ื above and อ after. Unlike plain ◌ือ, this อ stays when a final is added.",
    },
  },
  { id: "uua", group: "compound", vowelId: "uua", initial: "ส", final: "น", summary: { vi: "◌ั biến mất, còn ว", en: "◌ั vanishes, ว stays" } },
  {
    id: "taikhu", group: "tone", vowelId: "e", initial: "ล", final: "น", mark: "ek",
    summary: { vi: "Dấu thanh đẩy ◌็ ra ngoài", en: "A tone mark pushes out ◌็" },
    rule: {
      vi: "◌็ và dấu thanh cùng tranh một chỗ trên phụ âm. Khi có dấu thanh, ◌็ bị bỏ và nguyên âm vẫn được hiểu là ngắn.",
      en: "◌็ and a tone mark compete for the same spot above the consonant. With a tone mark, ◌็ is dropped and the vowel is still read as short.",
    },
  },
];

export interface MorphPiece {
  text: string;
  role: SegmentRole;
}

export interface MorphToken {
  /** Khoá ổn định giữa hai dạng để biết mảnh nào giữ lại */
  key: string;
  /** Chữ hiển thị = base + các dấu; dấu trên/dưới gộp vào chữ đứng trước để hiển thị đúng */
  text: string;
  role: SegmentRole;
  /** Chữ chính (không kèm dấu) */
  base: string;
  /** Các dấu trên/dưới gắn vào chữ này, kèm vai trò (nguyên âm hay dấu thanh) để tô màu riêng */
  marks: MorphPiece[];
}

export interface MorphExample {
  rule: MorphRule;
  from: SyllableAnalysis;
  to: SyllableAnalysis;
  fromTokens: MorphToken[];
  toTokens: MorphToken[];
  /** Mảnh có ở dạng trước nhưng không có ở dạng sau */
  removed: MorphPiece[];
  /** Mảnh mới ở dạng sau */
  added: MorphPiece[];
  explanation: string;
}

/** Dấu kết hợp (nằm trên/dưới chữ trước nó), cần dính vào chữ đó khi hiển thị */
const COMBINING = /^[ัิ-ฺ็-๎]/u;

export function morphTokens(a: SyllableAnalysis): MorphToken[] {
  const tokens: MorphToken[] = [];
  const seen = new Map<string, number>();
  for (const seg of a.segments) {
    for (const ch of seg.role === "initial" ? [seg.text] : [...seg.text]) {
      const prev = tokens.at(-1);
      if (prev && COMBINING.test(ch)) {
        prev.text += ch;
        prev.marks.push({ text: ch, role: seg.role });
        continue;
      }
      const id = seg.role === "initial" ? "c" : seg.role === "final" ? "f" : `${seg.role}:${ch}`;
      const n = seen.get(id) ?? 0;
      seen.set(id, n + 1);
      tokens.push({ key: n ? `${id}#${n}` : id, text: ch, role: seg.role, base: ch, marks: [] });
    }
  }
  return tokens;
}

const pieces = (a: SyllableAnalysis): MorphPiece[] =>
  a.segments.flatMap((s) => (s.role === "initial" ? [] : [...s.text].map((text) => ({ text, role: s.role }))));

/** Hiệu hai danh sách theo số lần xuất hiện */
function minus(xs: MorphPiece[], ys: MorphPiece[]): MorphPiece[] {
  const rest = [...ys];
  return xs.filter((x) => {
    const i = rest.findIndex((y) => y.text === x.text);
    if (i < 0) return true;
    rest.splice(i, 1);
    return false;
  });
}

export function buildMorph(rule: MorphRule, locale: Locale = "vi"): MorphExample {
  const initial = INITIAL_BY_ID.get(rule.initial);
  const vowel = VOWEL_BY_ID.get(rule.vowelId);
  const final = CONSONANT_BY_ID.get(rule.final);
  if (!initial || !vowel || !final) throw new Error(`Quy tắc biến hình "${rule.id}" trỏ tới dữ liệu không tồn tại`);
  // Quy tắc dấu thanh: so dạng có âm cuối (chưa dấu) với dạng có dấu; còn lại: dạng mở → dạng đóng
  const from = rule.mark
    ? analyzeSyllable({ initial, vowel, final }, locale)
    : analyzeSyllable({ initial, vowel }, locale);
  const to = analyzeSyllable({ initial, vowel, final, mark: rule.mark ?? null }, locale);
  const a = pieces(from);
  const b = pieces(to);
  return {
    rule,
    from,
    to,
    fromTokens: morphTokens(from),
    toTokens: morphTokens(to),
    removed: minus(a, b),
    added: minus(b, a),
    explanation: (rule.rule ?? vowel.closedNote)?.[locale] ?? "",
  };
}

export const MORPH_BY_VOWEL = new Map(MORPH_RULES.filter((r) => !r.mark && r.id === r.vowelId).map((r) => [r.vowelId, r]));
