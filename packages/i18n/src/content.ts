import { CATALOGS, type Catalog } from "./catalog";
import { fmt, type Params } from "./format";
import { DEFAULT_LOCALE, LOCALES, type L10n, type Locale } from "./locale";

/** Đường dẫn tới một chuỗi trong catalog, vd. ["lexicon", "กา"] hay ["vowels", "approx", "a"] */
export type CatalogPath = readonly [keyof Catalog, ...string[]];

const lookup = (locale: Locale, path: CatalogPath): unknown =>
  path.reduce<unknown>((node, key) => (node && typeof node === "object" ? (node as Record<string, unknown>)[key] : undefined), CATALOGS[locale]);

const missing = (path: CatalogPath) => new Error(`[i18n] Thiếu chuỗi "${path.join(".")}" trong locales/${DEFAULT_LOCALE}/`);

function build(path: CatalogPath, pickValue: (locale: Locale) => unknown, params?: Params): L10n {
  const base = pickValue(DEFAULT_LOCALE);
  if (typeof base !== "string") throw missing(path);
  const out = {} as L10n;
  for (const locale of LOCALES) {
    const v = pickValue(locale);
    // Locale khác thiếu chuỗi thì dùng tạm locale mặc định
    const s = typeof v === "string" ? v : base;
    out[locale] = params ? fmt(s, params) : s;
  }
  return out;
}

/** Gom một chuỗi của mọi locale thành L10n. Thiếu ở locale mặc định là lỗi dữ liệu nên ném lỗi ngay. */
export const l10n = (path: CatalogPath, params?: Params): L10n => build(path, (l) => lookup(l, path), params);

/** Như l10n nhưng trả undefined nếu locale mặc định không có chuỗi này (trường tuỳ chọn). */
export const l10nOptional = (path: CatalogPath, params?: Params): L10n | undefined =>
  lookup(DEFAULT_LOCALE, path) === undefined ? undefined : l10n(path, params);

/** Mảng chuỗi (vd. facts) → mảng L10n, độ dài theo locale mặc định. */
export function l10nList(path: CatalogPath): L10n[] {
  const base = lookup(DEFAULT_LOCALE, path);
  if (!Array.isArray(base)) throw missing(path);
  return base.map((_, i) => build([...path, String(i)], (l) => (lookup(l, path) as unknown[] | undefined)?.[i]));
}
