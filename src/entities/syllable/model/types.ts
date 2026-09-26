import type { FinalSound, InitialUnit, ConsonantClass, Consonant } from "../../consonant/@x/syllable";
import type { Vowel, VowelPlacement } from "../../vowel/@x/syllable";
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
  /** CSS color để tô bước này */
  color?: string;
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
