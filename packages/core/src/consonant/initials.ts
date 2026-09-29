import { l10n } from "@abugikha/i18n";
import type { InitialUnit } from "./types";
import { CONSONANTS, CONSONANT_BY_ID } from "./data";

const unit = (chars: string, ipa: string, kind: InitialUnit["kind"], common = true, note?: InitialUnit["note"]): InitialUnit => {
  const head = CONSONANT_BY_ID.get(chars[0])!;
  return { id: chars, chars, ipa, cls: head.cls, kind, head: head.char, common, note };
};

/** Ghi chú nằm ở locales/<locale>/initials.json */
const CLUSTER_NOTE = l10n(["initials", "clusterNote"]);
const note = (chars: string) => l10n(["initials", "note", chars]);

export const INITIAL_UNITS: InitialUnit[] = [
  ...CONSONANTS.filter((c) => !c.obsolete).map((c) => ({
    id: c.id, chars: c.char, ipa: c.initial, cls: c.cls, kind: "single" as const, head: c.char, common: c.common,
  })),
  // Phụ âm ghép thật (อักษรควบแท้)
  unit("กร", "kr", "cluster", true, CLUSTER_NOTE),
  unit("กล", "kl", "cluster", true, CLUSTER_NOTE),
  unit("กว", "kw", "cluster", true, CLUSTER_NOTE),
  unit("ขร", "kʰr", "cluster", false, CLUSTER_NOTE),
  unit("ขล", "kʰl", "cluster", false, CLUSTER_NOTE),
  unit("ขว", "kʰw", "cluster", true, CLUSTER_NOTE),
  unit("คร", "kʰr", "cluster", true, CLUSTER_NOTE),
  unit("คล", "kʰl", "cluster", true, CLUSTER_NOTE),
  unit("คว", "kʰw", "cluster", true, CLUSTER_NOTE),
  unit("ปร", "pr", "cluster", true, CLUSTER_NOTE),
  unit("ปล", "pl", "cluster", true, CLUSTER_NOTE),
  unit("ผล", "pʰl", "cluster", false, CLUSTER_NOTE),
  unit("พร", "pʰr", "cluster", true, CLUSTER_NOTE),
  unit("พล", "pʰl", "cluster", true, CLUSTER_NOTE),
  unit("ตร", "tr", "cluster", true, CLUSTER_NOTE),
  // Ghép không thật (อักษรควบไม่แท้): ร không đọc, hoặc ทร đọc thành /s/
  unit("ทร", "s", "false-cluster", true, note("ทร")),
  unit("จร", "tɕ", "false-cluster", true, note("จร")),
  unit("สร", "s", "false-cluster", true, note("สร")),
  unit("ศร", "s", "false-cluster", false, note("ศร")),
  // Chữ nhấn (อักษรนำ): chữ đầu câm, nhóm theo chữ đầu
  ...["ง", "ญ", "น", "ม", "ย", "ร", "ล", "ว"].map((c) => {
    const ipa = CONSONANT_BY_ID.get(c)!.initial;
    return unit(`ห${c}`, ipa, "leading", true, l10n(["initials", "silentHo"], { chars: `ห${c}`, ipa }));
  }),
  unit("อย", "j", "leading", true, note("อย")),
];

export const INITIAL_BY_ID = new Map(INITIAL_UNITS.map((u) => [u.id, u]));
