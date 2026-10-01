"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteNav } from "@/widgets/site-nav";
import { stripLocale } from "@/shared/config/routes";
import { cn } from "@/shared/lib";

/** Trang chủ và trang lịch sử tràn hết chiều ngang (phần mở đầu, dòng thời gian cuộn ngang); các trang khác nằm trong khung. */
export function RootShell({ children }: { children: ReactNode }) {
  const bleed = ["/", "/history"].includes(stripLocale(usePathname() ?? "/"));
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/85 backdrop-blur">
        <SiteNav />
      </header>
      <main className={cn("w-full", !bleed && "mx-auto max-w-[1440px] px-3 pb-8 pt-4 sm:px-4 md:px-6 md:pt-5")}>{children}</main>
    </div>
  );
}
