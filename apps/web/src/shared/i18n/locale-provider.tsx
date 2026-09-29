"use client";
import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DEFAULT_LOCALE, DICTS, type L10n, type Locale } from "@abugikha/i18n";
import { setCookie } from "../lib/cookie";
import { localizePath, stripLocale } from "../config/routes";

interface Ctx {
  locale: Locale;
  setLocale: (l: Locale) => void;
}
const LocaleContext = createContext<Ctx>({ locale: DEFAULT_LOCALE, setLocale: () => {} });

/** Locale lấy từ segment `/[locale]` của URL; đổi ngôn ngữ = chuyển sang cùng trang ở locale kia. */
export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const setLocale = useCallback(
    (l: Locale) => {
      // Cookie chỉ để trang gốc "/" nhớ lựa chọn khi chuyển hướng lần sau
      setCookie("locale", l);
      router.push(localizePath(l, stripLocale(pathname ?? "/")));
    },
    [router, pathname],
  );
  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => useContext(LocaleContext);
export const useT = () => DICTS[useContext(LocaleContext).locale];
/** Chọn bản dịch cho dữ liệu song ngữ */
export function useL() {
  const { locale } = useContext(LocaleContext);
  return useCallback((x: L10n) => x[locale], [locale]);
}
/** Gắn locale hiện tại vào đường dẫn nội bộ: href("/lab") → "/vi/lab" */
export function useLocalePath() {
  const { locale } = useContext(LocaleContext);
  return useCallback((href: string) => localizePath(locale, href), [locale]);
}
