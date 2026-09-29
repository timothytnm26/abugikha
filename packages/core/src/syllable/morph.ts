import { l10n, l10nOptional, type L10n } from "@abugikha/i18n";
import { DEFAULT_LOCALE, type Locale } from "../i18n";
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

const RULES: Omit<MorphRule, "summary" | "rule">[] = [
  { id: "a", group: "short", vowelId: "a", initial: "ว", final: "น" },
  { id: "e", group: "short", vowelId: "e", initial: "ต", final: "ม" },
  { id: "ae", group: "short", vowelId: "ae", initial: "ข", final: "ง" },
  { id: "o", group: "short", vowelId: "o", initial: "ค", final: "น" },
  { id: "or", group: "short", vowelId: "or", initial: "ล", final: "ก" },
  { id: "uue", group: "long", vowelId: "uue", initial: "ม", final: "ด" },
  { id: "ooe", group: "long", vowelId: "ooe", initial: "ด", final: "น" },
  { id: "ooe-y", group: "long", vowelId: "ooe", initial: "ล", final: "ย" },
  { id: "iia", group: "compound", vowelId: "iia", initial: "ร", final: "น" },
  { id: "uuea", group: "compound", vowelId: "uuea", initial: "ร", final: "น" },
  { id: "uua", group: "compound", vowelId: "uua", initial: "ส", final: "น" },
  { id: "taikhu", group: "tone", vowelId: "e", initial: "ล", final: "น", mark: "ek" },
];

/** Tóm tắt và giải thích nằm ở locales/<locale>/morph.json, khoá là id quy tắc */
export const MORPH_RULES: MorphRule[] = RULES.map((r) => ({
  ...r,
  summary: l10n(["morph", r.id, "summary"]),
  rule: l10nOptional(["morph", r.id, "rule"]),
}));

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

export function buildMorph(rule: MorphRule, locale: Locale = DEFAULT_LOCALE): MorphExample {
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
