"use client";
import { useLocale, useT } from "@/shared/i18n";

export function LocaleSwitch() {
  const { locale, setLocale } = useLocale();
  const t = useT();
  return (
    <button
      type="button"
      onClick={() => setLocale(locale === "vi" ? "en" : "vi")}
      aria-label={t.nav.switchLocale}
      title={t.nav.switchLocale}
      className="grid h-9 min-w-9 place-items-center rounded-full border border-ink/15 px-2.5 text-xs font-semibold hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      {t.nav.localeShort}
    </button>
  );
}
