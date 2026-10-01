"use client";
import type { ReactNode } from "react";
import { Asterisk } from "./poster-tile";

/** Đầu trang công cụ: dấu sao cam, tít condensed rất lớn và một câu dẫn, tất cả trên nền giấy. */
export function PageIntro({ title, children }: { title: string; children: ReactNode }) {
  return (
    <header className="page-container pb-4 pt-10 md:pb-6 md:pt-20">
      <Asterisk className="size-8 text-poster-orange md:size-10" />
      <h1 className="mt-3 text-balance font-poster text-6xl font-extrabold uppercase leading-[0.92] md:text-9xl">{title}</h1>
      <div className="mt-5 max-w-[56ch] text-lg leading-snug text-ink-soft md:text-xl">{children}</div>
    </header>
  );
}
