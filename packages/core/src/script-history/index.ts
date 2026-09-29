import { l10n, l10nList, type L10n } from "@abugikha/i18n";

export interface ScriptNode {
  id: string;
  name: L10n;
  period: L10n;
  region: L10n;
  ka?: string;
  kaFont?: string;
  summary: L10n;
  facts: L10n[];
  x: number;
  y: number;
}

export interface ScriptEdge {
  from: string;
  to: string;
  kind: "descent" | "influence";
}

/** Toạ độ trong viewBox 1000 × 640. Niên đại là ước lượng theo các nghiên cứu phổ biến. */
const NODES: Omit<ScriptNode, "name" | "period" | "region" | "summary" | "facts">[] = [
  { id: "brahmi", ka: "𑀓", kaFont: "font-brahmi", x: 90, y: 300 },
  { id: "pallava", x: 270, y: 300 },
  { id: "old-mon", x: 450, y: 150 },
  { id: "old-khmer", ka: "ក", kaFont: "font-khmer", x: 450, y: 420 },
  { id: "sukhothai", x: 640, y: 330 },
  { id: "tai-tham", ka: "ᨠ", kaFont: "font-taitham", x: 640, y: 120 },
  { id: "fakkham", x: 820, y: 210 },
  { id: "lao", ka: "ກ", kaFont: "font-lao", x: 820, y: 330 },
  { id: "ayutthaya", x: 820, y: 460 },
  { id: "modern", ka: "ก", kaFont: "font-thai", x: 930, y: 550 },
];

/** Tên, niên đại, vùng, tóm tắt và các ý chính nằm ở locales/<locale>/script-history.json, khoá là id */
export const SCRIPT_NODES: ScriptNode[] = NODES.map((n) => ({
  ...n,
  name: l10n(["scriptHistory", n.id, "name"]),
  period: l10n(["scriptHistory", n.id, "period"]),
  region: l10n(["scriptHistory", n.id, "region"]),
  summary: l10n(["scriptHistory", n.id, "summary"]),
  facts: l10nList(["scriptHistory", n.id, "facts"]),
}));

export const SCRIPT_EDGES: ScriptEdge[] = [
  { from: "brahmi", to: "pallava", kind: "descent" },
  { from: "pallava", to: "old-mon", kind: "descent" },
  { from: "pallava", to: "old-khmer", kind: "descent" },
  { from: "old-khmer", to: "sukhothai", kind: "descent" },
  { from: "old-mon", to: "sukhothai", kind: "influence" },
  { from: "old-mon", to: "tai-tham", kind: "descent" },
  { from: "sukhothai", to: "fakkham", kind: "descent" },
  { from: "sukhothai", to: "lao", kind: "descent" },
  { from: "sukhothai", to: "ayutthaya", kind: "descent" },
  { from: "ayutthaya", to: "modern", kind: "descent" },
];

/** Tổ tiên của một node (chỉ theo quan hệ "descent") để tô sáng dòng dõi. */
export function lineageOf(id: string): Set<string> {
  const out = new Set<string>([id]);
  let frontier = [id];
  while (frontier.length) {
    const next: string[] = [];
    for (const n of frontier)
      for (const e of SCRIPT_EDGES)
        if (e.to === n && e.kind === "descent" && !out.has(e.from)) {
          out.add(e.from);
          next.push(e.from);
        }
    frontier = next;
  }
  return out;
}
