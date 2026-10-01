"use client";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { PosterTile, type PosterBg } from "./poster-tile";

/** Dải tiêu đề đầu trang: ô màu tràn hết chiều ngang, tít condensed viết hoa; bản `compact` thấp hơn cho trang công cụ. */
export function PageIntro({ title, compact, bg, children }: { title: string; compact?: boolean; bg: PosterBg; children: ReactNode }) {
  return (
    <header>
      <PosterTile bg={bg} pad={compact ? "py-4 md:py-6" : "py-8 md:py-14"}>
        <div className={cn("page-container", compact ? "flex flex-wrap items-baseline gap-x-6 gap-y-1" : "")}>
          <h1 className={cn("font-poster font-extrabold uppercase leading-[0.98]", compact ? "text-4xl md:text-6xl" : "text-5xl md:text-8xl")}>{title}</h1>
          <div className={cn("max-w-[60ch] leading-snug", compact ? "text-base md:text-lg" : "mt-4 text-lg md:text-xl")}>{children}</div>
        </div>
      </PosterTile>
    </header>
  );
}
