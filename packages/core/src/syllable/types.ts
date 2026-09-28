import type { FinalSound, InitialUnit, ConsonantClass, Consonant } from "../consonant";
import type { Vowel, VowelPlacement } from "../vowel";
import type { PaletteKey } from "../theme";
import type { Liveness, Tone, ToneMarkId } from "./tone";

export interface SyllableInput {
  initial: InitialUnit;
  vowel: Vowel;
  final?: Consonant | null;
  mark?: ToneMarkId | null;
}

export type SegmentRole = "vowel" | "initial" | "mark" | "final";
export interface Segment {
  text: string;
  role: SegmentRole;
}

export type StepKind = "class" | "vowel" | "final" | "liveness" | "mark" | "result";
export interface RuleStep {
  kind: StepKind;
  title: string;
  detail: string;
  /** Màu nhấn của bước này (lớp phụ âm hoặc thanh); mỗi nền tảng tự đổi sang màu thật */
  accent?: PaletteKey;
}

export interface SyllableAnalysis {
  key: string;
  spelling: string;
  segments: Segment[];
  ipa: string;
  tone: Tone;
  cls: ConsonantClass;
  liveness: Liveness;
  length: Vowel["length"];
  form: "open" | "closed";
  finalSound: FinalSound | null;
  /** Âm cuối bị bỏ vì nguyên âm không đi với âm cuối */
  finalDropped: boolean;
  mark: ToneMarkId | null;
  placements: VowelPlacement[];
  steps: RuleStep[];
  warnings: string[];
}
