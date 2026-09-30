import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers, RootShell } from "@/app";
import { THEME_BOOT_SCRIPT } from "@/shared/config/themes";
import "@/app/styles/globals.css";

export const metadata: Metadata = {
  title: "NarakThai (น่ารักไทย) - Thai Script Lab",
  description:
    "Explore Thai sounds, script history, syllables, and tones with NarakThai, a cute way to learn. / Khám phá âm thanh, lịch sử chữ viết, âm tiết và thanh điệu tiếng Thái cùng NarakThai.",
};

const FONTS =
  "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600&family=Charis+SIL:ital,wght@0,400;0,700;1,400&family=Noto+Serif+Thai:wght@400;500;600&family=Noto+Sans+Thai:wght@400;500;600&family=Noto+Sans+Khmer&family=Noto+Sans+Lao&family=Noto+Sans+Tai+Tham&family=Noto+Sans+Brahmi&display=swap";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>
        <Providers locale="vi">
          <RootShell>{children}</RootShell>
        </Providers>
      </body>
    </html>
  );
}
