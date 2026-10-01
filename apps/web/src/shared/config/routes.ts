import { LOCALES, type Locale } from "@abugikha/core";

export const LEARNING_PATH = [
  { href: "/history", step: 1, key: "history" },
  { href: "/ipa", step: 2, key: "ipa" },
  { href: "/aksornthai", step: 3, key: "aksornthai" },
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
