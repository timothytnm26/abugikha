import type { InitialUnit } from "./types";
import { CONSONANTS, CONSONANT_BY_ID } from "./data";

const unit = (chars: string, ipa: string, kind: InitialUnit["kind"], common = true, note?: InitialUnit["note"]): InitialUnit => {
  const head = CONSONANT_BY_ID.get(chars[0])!;
  return { id: chars, chars, ipa, cls: head.cls, kind, head: head.char, common, note };
};

const CLUSTER_NOTE = { vi: "Hai phụ âm đọc liền nhau, không chen nguyên âm.", en: "Two consonants said together, with no vowel between." };

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
  unit("ทร", "s", "false-cluster", true, { vi: "ทร đọc thành /s/ như ซ (ทราย, ทราบ).", en: "ทร is read /s/, like ซ (ทราย, ทราบ)." }),
  unit("จร", "tɕ", "false-cluster", true, { vi: "ร câm: จร đọc như จ (จริง).", en: "Silent ร: จร is read like จ (จริง)." }),
  unit("สร", "s", "false-cluster", true, { vi: "ร câm: สร đọc như ส (สร้าง).", en: "Silent ร: สร is read like ส (สร้าง)." }),
  unit("ศร", "s", "false-cluster", false, { vi: "ร câm: ศร đọc như ศ (ศรี).", en: "Silent ร: ศร is read like ศ (ศรี)." }),
  // Chữ nhấn (อักษรนำ): chữ đầu câm, nhóm theo chữ đầu
  ...["ง", "ญ", "น", "ม", "ย", "ร", "ล", "ว"].map((c) =>
    unit(`ห${c}`, CONSONANT_BY_ID.get(c)!.initial, "leading", true, {
      vi: `ห không đọc, chỉ báo nhóm Cao: ห${c} đọc là /${CONSONANT_BY_ID.get(c)!.initial}/ theo luật nhóm Cao.`,
      en: `ห is silent and only marks high class: ห${c} is read /${CONSONANT_BY_ID.get(c)!.initial}/ with high-class rules.`,
    }),
  ),
  unit("อย", "j", "leading", true, {
    vi: "อ không đọc, chỉ báo nhóm Trung. Chỉ có 4 từ: อย่า อยู่ อย่าง อยาก.",
    en: "อ is silent and only marks mid class. Only 4 words: อย่า อยู่ อย่าง อยาก.",
  }),
];

export const INITIAL_BY_ID = new Map(INITIAL_UNITS.map((u) => [u.id, u]));
