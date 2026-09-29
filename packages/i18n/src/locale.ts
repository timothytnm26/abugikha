/** Thêm ngôn ngữ mới: thêm mã vào đây và tạo thư mục locales/<mã>/ (chép từ locales/vi/). */
export const LOCALES = ["vi", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "vi";
/** Chuỗi song ngữ dùng trong dữ liệu */
export type L10n = Record<Locale, string>;
export const pick = (x: L10n, locale: Locale) => x[locale];
export const isLocale = (x: unknown): x is Locale => (LOCALES as readonly unknown[]).includes(x);
