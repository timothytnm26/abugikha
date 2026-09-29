import { CLASS_META, type FinalSound } from "../consonant";
import { closedPattern, vowelFitsInitial, vowelPlacements } from "../vowel";
import { DEFAULT_LOCALE, type Locale } from "../i18n";
import { TONE_MARK_BY_ID, TONE_META } from "./tone";
import type { RuleStep, Segment, SyllableAnalysis, SyllableInput } from "./types";
import { toneKey } from "../theme";
import { resolveTone } from "./tone-rules";
import { CATALOGS, fmt } from "@abugikha/i18n";

const SONORANT_FINALS: FinalSound[] = ["m", "n", "ŋ", "j", "w"];
const ABOVE_BELOW = /^[ัิีึืุู]/;

/**
 * Ghép chữ theo mẫu nguyên âm. Dấu thanh và nguyên âm trên/dưới gắn vào chữ CUỐI
 * của cụm phụ âm đầu (vd. เปลี่ยน, หน้า, ใกล้) – đúng thứ tự Unicode.
 */
function spell(pattern: string, input: SyllableInput): Segment[] {
  const [headRaw, tailRaw = ""] = pattern.split("C");
  const segs: Segment[] = [];
  if (headRaw) segs.push({ text: headRaw, role: "vowel" });
  segs.push({ text: input.initial.chars, role: "initial" });

  let tail = tailRaw;
  const mark = input.mark ? TONE_MARK_BY_ID.get(input.mark)!.char : null;
  let before = "";
  if (mark) {
    if (tail.startsWith("็")) tail = tail.slice(1); // dấu thanh thay chỗ mái tai-khu
    else if (ABOVE_BELOW.test(tail)) {
      before = tail[0];
      tail = tail.slice(1);
    }
  }
  if (before) segs.push({ text: before, role: "vowel" });
  if (mark) segs.push({ text: mark, role: "mark" });

  const [tailVowel, afterFinal = ""] = tail.split("F");
  if (tailVowel) segs.push({ text: tailVowel, role: "vowel" });
  if (tail.includes("F") && input.final) segs.push({ text: input.final.char, role: "final" });
  if (afterFinal) segs.push({ text: afterFinal, role: "vowel" });
  return segs;
}

const withTone = (ipa: string, diacritic: string) => (diacritic ? ipa[0] + diacritic + ipa.slice(1) : ipa);

export function analyzeSyllable(input: SyllableInput, locale: Locale = DEFAULT_LOCALE): SyllableAnalysis {
  const { initial, vowel } = input;
  const m = CATALOGS[locale].analysis;
  const warnings: string[] = [];
  const steps: RuleStep[] = [];
  const cls = initial.cls;
  const clsLabel = CLASS_META[cls].label[locale];

  // 1. Phụ âm đầu (đơn / ghép / chữ nhấn) – nhóm luôn theo chữ đứng đầu
  const noteText = initial.note?.[locale];
  if (initial.kind === "single") {
    steps.push({ kind: "class", title: fmt(m.single, { ch: initial.chars, cls: clsLabel }), detail: fmt(m.singleDetail, { ch: initial.chars, thai: CLASS_META[cls].thai, ipa: initial.ipa }), accent: cls });
  } else if (initial.kind === "cluster") {
    steps.push({ kind: "class", title: fmt(m.cluster, { ch: initial.chars, cls: clsLabel }), detail: fmt(m.clusterDetail, { ch: initial.chars, head: initial.head, cls: clsLabel, ipa: initial.ipa }), accent: cls });
  } else if (initial.kind === "false-cluster") {
    steps.push({ kind: "class", title: fmt(m.falseCluster, { ch: initial.chars, cls: clsLabel }), detail: `${noteText ?? ""} ${fmt(m.leadingDetail, { head: initial.head, cls: clsLabel })}`.trim(), accent: cls });
  } else {
    steps.push({ kind: "class", title: fmt(m.leading, { ch: initial.chars, cls: clsLabel }), detail: `${noteText ?? ""} ${fmt(m.leadingDetail, { head: initial.head, cls: clsLabel })}`.trim(), accent: cls });
  }

  if (!vowelFitsInitial(vowel, initial.chars)) warnings.push(fmt(m.wCluster, { ch: initial.chars }));

  // 2. Hình nguyên âm: mở hay đóng
  let final = input.final ?? null;
  let finalDropped = false;
  if (final && !final.final) {
    warnings.push(fmt(m.noFinal, { ch: final.char }));
    final = null;
  }
  if (final && vowel.excludeFinals?.includes(final.char)) {
    warnings.push(fmt(m.excluded, { ch: final.char }));
    final = null;
    finalDropped = true;
  }
  if (final && !vowel.closed) {
    warnings.push(m.noClosed);
    final = null;
    finalDropped = true;
  }
  const form = final ? "closed" : "open";
  const pattern = form === "closed" ? closedPattern(vowel, final!.char)! : vowel.open;
  const placements = vowelPlacements(pattern);
  if (form === "closed" && vowel.closedNote) steps.push({ kind: "vowel", title: m.vowelShape, detail: vowel.closedNote[locale] });

  // 3. Phụ âm cuối
  const finalSound = final?.final ?? null;
  if (final && finalSound) {
    steps.push({
      kind: "final",
      title: fmt(m.finalAs, { ch: final.char, sound: finalSound }),
      detail: final.initial !== finalSound ? fmt(m.finalChanged, { ch: final.char, initial: final.initial, final: finalSound }) : fmt(m.finalSame, { ch: final.char, sound: finalSound }),
    });
  }

  // 4. Âm sống / âm chết
  let liveness: "live" | "dead";
  let reason: string;
  if (vowel.alwaysLive) {
    liveness = "live";
    reason = fmt(m.liveSpecial, { vowel: vowel.open.replace("C", "◌"), sound: vowel.ipa.slice(-1) });
  } else if (finalSound) {
    liveness = SONORANT_FINALS.includes(finalSound) ? "live" : "dead";
    reason = liveness === "live" ? fmt(m.liveFinal, { sound: finalSound }) : fmt(m.deadFinal, { sound: finalSound });
  } else {
    liveness = vowel.length === "long" ? "live" : "dead";
    reason = liveness === "live" ? m.liveOpen : m.deadOpen;
  }
  steps.push({ kind: "liveness", title: liveness === "live" ? m.live : m.dead, detail: reason });

  // 5. Dấu thanh → thanh điệu
  const mark = input.mark ?? null;
  const { tone, rule, irregular } = resolveTone({ cls, liveness, length: vowel.length, mark }, locale);
  if (irregular) warnings.push(irregular);
  if (mark) {
    const tm = TONE_MARK_BY_ID.get(mark)!;
    steps.push({ kind: "mark", title: fmt(m.markTitle, { thai: tm.thai, ch: tm.char }), detail: fmt(m.markDetail, { last: initial.chars.slice(-1), above: placements.includes("above") ? m.markAbove : "" }) });
  }
  steps.push({ kind: "result", title: fmt(m.result, { tone: TONE_META[tone].label[locale], thai: TONE_META[tone].thai }), detail: rule, accent: toneKey(tone) });

  const nucleus = withTone(vowel.ipa, TONE_META[tone].diacritic);
  const coda = finalSound ?? (vowel.length === "short" && !vowel.alwaysLive ? "ʔ" : "");
  const segments = spell(pattern, { ...input, final });

  return {
    key: [initial.id, vowel.id, final?.id ?? "", mark ?? ""].join("|"),
    spelling: segments.map((s) => s.text).join(""),
    segments,
    ipa: `${initial.ipa}${nucleus}${coda}`.normalize("NFC"),
    tone, cls, liveness, length: vowel.length, form, finalSound, finalDropped, mark, placements, steps, warnings,
  };
}
