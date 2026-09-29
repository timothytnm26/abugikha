import { notFound } from "next/navigation";
import { isLocale, LOCALES, type Locale } from "@abugikha/i18n";

export type LocaleParams = { params: Promise<{ locale: string }> };

/** Dựng sẵn mọi locale khi static export. */
export const localeStaticParams = () => LOCALES.map((locale) => ({ locale }));

export async function resolveLocale(params: LocaleParams["params"]): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}
