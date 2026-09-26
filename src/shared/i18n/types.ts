export type Locale = "vi" | "en";
export const LOCALES: Locale[] = ["vi", "en"];
/** Chuỗi song ngữ dùng trong dữ liệu entity */
export type L10n = Record<Locale, string>;
export const pick = (x: L10n, locale: Locale) => x[locale];
