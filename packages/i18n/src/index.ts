import type { Locale } from "@abugikha/core";
import { en } from "./dict/en";
import { vi, type Dict } from "./dict/vi";

export { vi, en, type Dict };
export const DICTS: Record<Locale, Dict> = { vi, en };
export { LOCALES, DEFAULT_LOCALE, isLocale, pick, type Locale, type L10n } from "@abugikha/core";
