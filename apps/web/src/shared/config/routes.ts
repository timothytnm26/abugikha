import { LOCALES, type Locale } from "@abugikha/core";

export const LEARNING_PATH = [
  { href: "/ipa", step: 1, key: "ipa" },
  { href: "/history", step: 2, key: "history" },
  { href: "/abugida", step: 3, key: "alphabet" },
  { href: "/lab", step: 4, key: "builder" },
] as const;
export const PATH_LENGTH = LEARNING_PATH.length;

/** Đường dẫn không kèm locale ("/lab") → đường dẫn thật ("/vi/lab"). */
export function localizePath(locale: Locale, href: string): string {
  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}

/** Bỏ tiền tố locale: "/en/lab/" → "/lab", "/vi" → "/". */
export function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.replace(/\/+$/, "").split("/");
  if (!(LOCALES as readonly string[]).includes(first ?? "")) return pathname || "/";
  return `/${rest.join("/")}`;
}
