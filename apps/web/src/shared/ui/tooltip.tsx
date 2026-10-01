"use client";
import { useId, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Tooltip nhẹ, mở bằng hover hoặc focus bàn phím. */
export function Tooltip({ content, children, className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(e) => e.key === "Escape" && open && (e.stopPropagation(), setOpen(false))}
      aria-describedby={open ? id : undefined}
    >
      {children}
      {open && (
        // Lớp đệm pb-3 nối trigger với thẻ để rê chuột sang thẻ mà không mất hover (WCAG 1.4.13)
        <span role="tooltip" id={id} className="absolute bottom-full left-1/2 z-50 -translate-x-1/2 pb-3">
          <span className="relative block w-max max-w-72 rounded-xl bg-ink px-4 py-3 text-left text-sm leading-snug text-paper shadow-[0_12px_30px_-12px_color-mix(in_oklab,var(--color-ink)_60%,transparent)]">
            {content}
            <span className="absolute left-1/2 top-full -translate-x-1/2 border-8 border-transparent border-t-ink" />
          </span>
        </span>
      )}
    </span>
  );
}
