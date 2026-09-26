import type { ReactNode } from "react";
import { SiteNav } from "@/widgets/site-nav";

export function RootShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/85 backdrop-blur">
        <SiteNav />
      </header>
      <main className="mx-auto w-full max-w-[1440px] px-4 pb-8 pt-4 md:px-6 md:pt-5">{children}</main>
    </div>
  );
}
