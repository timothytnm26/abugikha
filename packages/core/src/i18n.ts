export type Locale = "vi" | "en";
export const LOCALES = ["vi", "en"] as const satisfies readonly Locale[];
export const DEFAULT_LOCALE: Locale = "vi";
/** Chuỗi song ngữ dùng trong dữ liệu */
export type L10n = Record<Locale, string>;
export const pick = (x: L10n, locale: Locale) => x[locale];
export const isLocale = (x: unknown): x is Locale => x === "vi" || x === "en";
