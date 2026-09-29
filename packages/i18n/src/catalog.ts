import type { Locale } from "./locale";
import viUi from "../locales/vi/ui.json";
import viAnalysis from "../locales/vi/analysis.json";
import viConsonants from "../locales/vi/consonants.json";
import viInitials from "../locales/vi/initials.json";
import viVowels from "../locales/vi/vowels.json";
import viTones from "../locales/vi/tones.json";
import viPhonemes from "../locales/vi/phonemes.json";
import viScriptHistory from "../locales/vi/script-history.json";
import viLexicon from "../locales/vi/lexicon.json";
import viMorph from "../locales/vi/morph.json";
import enUi from "../locales/en/ui.json";
import enAnalysis from "../locales/en/analysis.json";
import enConsonants from "../locales/en/consonants.json";
import enInitials from "../locales/en/initials.json";
import enVowels from "../locales/en/vowels.json";
import enTones from "../locales/en/tones.json";
import enPhonemes from "../locales/en/phonemes.json";
import enScriptHistory from "../locales/en/script-history.json";
import enLexicon from "../locales/en/lexicon.json";
import enMorph from "../locales/en/morph.json";

const vi = {
  /** Giao diện web và mobile */
  ui: viUi,
  /** Lời giải thích do bộ phân tích âm tiết sinh ra */
  analysis: viAnalysis,
  consonants: viConsonants,
  initials: viInitials,
  vowels: viVowels,
  tones: viTones,
  phonemes: viPhonemes,
  scriptHistory: viScriptHistory,
  lexicon: viLexicon,
  morph: viMorph,
};

/** Cấu trúc của locale mặc định; các locale khác phải khớp đủ key (kiểm tra lúc typecheck). */
export type Catalog = typeof vi;

const en: Catalog = {
  ui: enUi,
  analysis: enAnalysis,
  consonants: enConsonants,
  initials: enInitials,
  vowels: enVowels,
  tones: enTones,
  phonemes: enPhonemes,
  scriptHistory: enScriptHistory,
  lexicon: enLexicon,
  morph: enMorph,
};

export const CATALOGS: Record<Locale, Catalog> = { vi, en };

export type Dict = Catalog["ui"];
export const DICTS: Record<Locale, Dict> = { vi: vi.ui, en: en.ui };
