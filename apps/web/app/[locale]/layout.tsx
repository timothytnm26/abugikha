import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers, RootShell } from "@/app";
import { FONTS } from "@/shared/config/fonts";
import { SKIN_BOOT_SCRIPT } from "@/shared/config/skins";
import { SITE_URL, pageMetadata } from "@/shared/config/metadata";
import { localeStaticParams, resolveLocale, type LocaleParams } from "@/shared/config/locale-params";
import "@/app/styles/globals.css";

export const dynamicParams = false;
export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return { metadataBase: new URL(SITE_URL), ...pageMetadata(locale, "/") };
}

export default async function LocaleLayout({ children, params }: LocaleParams & { children: ReactNode }) {
  const locale = await resolveLocale(params);
  return (
    <html lang={locale} data-skin="flat" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SKIN_BOOT_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>
        <Providers locale={locale}>
          <RootShell>{children}</RootShell>
        </Providers>
      </body>
    </html>
  );
}
