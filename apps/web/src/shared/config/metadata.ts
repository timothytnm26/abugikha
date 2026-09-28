import type { Metadata } from "next";
import { DICTS, LOCALES, type Locale } from "@abugikha/i18n";
import { localizePath } from "./routes";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type PageKey = "ipa" | "history" | "abugida" | "lab";

/** URL tuyệt đối (có basePath, dấu "/" cuối) cho một trang ở một locale. */
const absolute = (locale: Locale, path: string) => `${SITE_URL}${localizePath(locale, path)}/`;

/** Tiêu đề, mô tả, canonical và hreflang của một trang theo locale. */
export function pageMetadata(locale: Locale, path: string, page?: PageKey): Metadata {
  const m = DICTS[locale].meta;
  return {
    title: page ? `${m[page]} – Abugikha` : m.title,
    description: m.description,
    alternates: {
      canonical: absolute(locale, path),
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, absolute(l, path)])),
        "x-default": absolute("vi", path),
      },
    },
    openGraph: { locale: locale === "vi" ? "vi_VN" : "en_US" },
  };
}
