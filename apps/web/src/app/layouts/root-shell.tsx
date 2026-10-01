"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteNav } from "@/widgets/site-nav";
import { SiteFooter } from "@/widgets/site-footer";
import { useT } from "@/shared/i18n";
import { stripLocale } from "@/shared/config/routes";
import { cn } from "@/shared/lib";

/** Trang chủ và trang lịch sử tràn hết chiều ngang (phần mở đầu, dòng thời gian cuộn ngang); các trang khác nằm trong khung. */
export function RootShell({ children }: { children: ReactNode }) {
  const path = stripLocale(usePathname() ?? "/");
  const bleed = ["/", "/history"].includes(path);
  const t = useT();
  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        {t.nav.skipToContent}
      </a>
      <header className="sticky top-0 z-40 bg-poster-black text-white">
        <SiteNav />
      </header>
      <main id="main" tabIndex={-1} className={cn("w-full outline-none", !bleed && "mx-auto max-w-[1440px] px-3 pb-8 pt-4 sm:px-4 md:px-6 md:pt-5")}>{children}</main>
      {path === "/" && <SiteFooter />}
    </div>
  );
}
