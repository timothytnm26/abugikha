"use client";
import { useLocale, useT } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { CLASS_META } from "../model/class-meta";

/** Chú giải màu ba nhóm phụ âm; đặt ở trang dùng màu này (ghép chữ, bảng chữ cái), không để chiếm chỗ thanh điều hướng. */
export function ClassLegend({ className }: { className?: string }) {
  const { locale } = useLocale();
  const t = useT();
  return (
    <ul className={cn("flex items-center gap-3 text-xs text-ink-soft", className)} aria-label={t.nav.classColors}>
      {(["mid", "high", "low"] as const).map((c) => (
        <li key={c} className="flex items-center gap-1.5">
          <span className={cn("size-2.5 rounded-full", CLASS_META[c].bg)} /> {CLASS_META[c].label[locale]}
        </li>
      ))}
    </ul>
  );
}
