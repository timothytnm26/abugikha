"use client";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export function PageIntro({ title, compact, children }: { title: string; compact?: boolean; children: ReactNode }) {
  return (
    <header className={cn(compact ? "mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-1" : "mb-12 max-w-3xl")}>
      <h1 className={cn("font-semibold tracking-tight", compact ? "text-2xl md:text-3xl" : "text-4xl md:text-5xl")}>{title}</h1>
      <div className={cn("leading-relaxed text-ink/80", compact ? "text-sm text-ink-soft" : "mt-4 text-lg")}>{children}</div>
    </header>
  );
}
