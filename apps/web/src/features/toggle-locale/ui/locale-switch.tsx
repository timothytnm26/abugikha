"use client";
import { LOCALES, useLocale, useT } from "@/shared/i18n";

export function LocaleSwitch() {
  const { locale, setLocale } = useLocale();
  const t = useT();
  return (
    <button
      type="button"
      onClick={() => setLocale(LOCALES[(LOCALES.indexOf(locale) + 1) % LOCALES.length])}
      aria-label={t.nav.switchLocale}
      title={t.nav.switchLocale}
      className="nav-btn px-2.5 font-poster text-lg font-bold uppercase"
    >
      {t.nav.localeShort}
    </button>
  );
}
