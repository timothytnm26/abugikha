"use client";
import type { ReactNode } from "react";
import { LocaleProvider, type Locale } from "@/shared/i18n";
import { QueryProvider } from "./query-provider";
import { PreferencesSync } from "@/features/customize-appearance";

export function Providers({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <LocaleProvider initial={locale}>
      <QueryProvider>
        <PreferencesSync />
        {children}
      </QueryProvider>
    </LocaleProvider>
  );
}
