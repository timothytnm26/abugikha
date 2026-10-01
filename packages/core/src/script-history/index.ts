import { l10n, l10nList, type L10n } from "@abugikha/i18n";

/** Khoá font của chữ "ka" minh hoạ; web đọc qua biến CSS --font-<khoá>. */
export type GlyphFont = "thai" | "brahmi" | "khmer" | "lao" | "taitham" | "devanagari" | "tamil" | "javanese" | "cham" | "taiviet";

/** Một chặng trên dòng chính, từ Brahmi đến chữ Thái hiện đại (xếp theo thời gian). */
export interface ScriptEra {
  id: string;
  name: L10n;
  /** Mốc ngắn hiển thị lớn, vd. "1283" */
  year: L10n;
  period: L10n;
  region: L10n;
  summary: L10n;
  facts: L10n[];
  /** Chặng này để lại / thay đổi điều gì cho chữ Thái */
  change: L10n;
  ka?: string;
  font?: GlyphFont;
}

/** Nhánh rẽ khỏi dòng chính sang hệ chữ khác; chỉ để tham khảo nên web vẽ màu xám. */
export interface ScriptBranch {
  id: string;
  /** id của chặng mà nhánh này rẽ ra */
  from: string;
  name: L10n;
  period: L10n;
  note: L10n;
  ka?: string;
  font?: GlyphFont;
}

const ERAS: Pick<ScriptEra, "id" | "ka" | "font">[] = [
  { id: "brahmi", ka: "𑀓", font: "brahmi" },
  { id: "pallava" },
  { id: "old-khmer", ka: "ក", font: "khmer" },
  { id: "sukhothai", ka: "ก", font: "thai" },
  { id: "ayutthaya", ka: "ก", font: "thai" },
  { id: "rattanakosin", ka: "ก", font: "thai" },
  { id: "modern", ka: "ก", font: "thai" },
];

/** Tên, niên đại, tóm tắt và các ý chính nằm ở locales/<locale>/script-history.json, khoá là id */
export const SCRIPT_ERAS: ScriptEra[] = ERAS.map((e) => ({
  ...e,
  name: l10n(["scriptHistory", "eras", e.id, "name"]),
  year: l10n(["scriptHistory", "eras", e.id, "year"]),
  period: l10n(["scriptHistory", "eras", e.id, "period"]),
  region: l10n(["scriptHistory", "eras", e.id, "region"]),
  summary: l10n(["scriptHistory", "eras", e.id, "summary"]),
  facts: l10nList(["scriptHistory", "eras", e.id, "facts"]),
  change: l10n(["scriptHistory", "eras", e.id, "change"]),
}));

const BRANCHES: Pick<ScriptBranch, "id" | "from" | "ka" | "font">[] = [
  { id: "devanagari", from: "brahmi", ka: "क", font: "devanagari" },
  { id: "tamil", from: "brahmi", ka: "க", font: "tamil" },
  { id: "old-mon", from: "pallava" },
  { id: "cham", from: "pallava", ka: "ꨆ", font: "cham" },
  { id: "javanese", from: "pallava", ka: "ꦏ", font: "javanese" },
  { id: "khmer", from: "old-khmer", ka: "ក", font: "khmer" },
  { id: "khom-thai", from: "old-khmer" },
  { id: "tai-tham", from: "sukhothai", ka: "ᨠ", font: "taitham" },
  { id: "fakkham", from: "sukhothai" },
  { id: "tai-viet", from: "sukhothai", ka: "ꪀ", font: "taiviet" },
  { id: "lao", from: "ayutthaya", ka: "ກ", font: "lao" },
];

export const SCRIPT_BRANCHES: ScriptBranch[] = BRANCHES.map((b) => ({
  ...b,
  name: l10n(["scriptHistory", "branches", b.id, "name"]),
  period: l10n(["scriptHistory", "branches", b.id, "period"]),
  note: l10n(["scriptHistory", "branches", b.id, "note"]),
}));

export const branchesOf = (eraId: string): ScriptBranch[] => SCRIPT_BRANCHES.filter((b) => b.from === eraId);
