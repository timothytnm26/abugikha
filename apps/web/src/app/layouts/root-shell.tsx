"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteNav } from "@/widgets/site-nav";
import { SiteFooter } from "@/widgets/site-footer";
import { useT } from "@/shared/i18n";
import { stripLocale } from "@/shared/config/routes";

/** Trang chủ và trang lịch sử tràn hết chiều ngang (phần mở đầu, dòng thời gian cuộn ngang); các trang khác nằm trong khung. */
export function RootShell({ children }: { children: ReactNode }) {
  const path = stripLocale(usePathname() ?? "/");
  const t = useT();
  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        {t.nav.skipToContent}
      </a>
      <header className="sticky top-0 z-40 border-b-2 border-pastel bg-paper text-ink">
        <SiteNav />
      </header>
      <main id="main" tabIndex={-1} className="w-full outline-none">{children}</main>
      {path === "/" && <SiteFooter />}
    </div>
  );
}
