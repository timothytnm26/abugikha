"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getCookie, setCookie } from "../lib/cookie";
import { en } from "./dict/en";
import { vi, type Dict } from "./dict/vi";
import type { L10n, Locale } from "./types";

const DICTS: Record<Locale, Dict> = { vi, en };

interface Ctx {
  locale: Locale;
  setLocale: (l: Locale) => void;
}
const LocaleContext = createContext<Ctx>({ locale: "vi", setLocale: () => {} });

export function LocaleProvider({
  initial,
  children,
}: {
  initial: Locale;
  children: ReactNode;
}) {
  const [locale, set] = useState<Locale>(initial);
  const setLocale = useCallback((l: Locale) => {
    set(l);
    setCookie("locale", l);
    document.documentElement.lang = l;
  }, []);
  useEffect(() => {
    const saved = getCookie("locale");
    if (saved === "vi" || saved === "en") setLocale(saved);
  }, [setLocale]);
  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
export const useT = () => DICTS[useContext(LocaleContext).locale];
/** Chọn bản dịch cho dữ liệu song ngữ */
export function useL() {
  const { locale } = useContext(LocaleContext);
  return useCallback((x: L10n) => x[locale], [locale]);
}
