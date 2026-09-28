export type { SyllableInput, SyllableAnalysis, Segment, RuleStep } from "@abugikha/core/syllable";
export type { Tone, ToneMark, ToneMarkId, Liveness } from "@abugikha/core/syllable";
export { TONE_MARKS, TONE_MARK_BY_ID, analyzeSyllable, resolveTone } from "@abugikha/core/syllable";
export { TONE_META } from "./model/tone";
export { SyllableCard, SyllableGlyph } from "./ui/syllable-card";
export { ToneContour } from "./ui/tone-contour";
export { RuleBreakdown } from "./ui/rule-breakdown";
export { PlacementNote } from "./ui/placement-note";
export { VowelMorph } from "./ui/vowel-morph";
export {
  ToneRuleTable,
  toneColumnOf,
  type ToneCol,
} from "./ui/tone-rule-table";
