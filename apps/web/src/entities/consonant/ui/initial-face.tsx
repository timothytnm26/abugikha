"use client";
import type { InitialUnit } from "@abugikha/core/consonant";
import { CLASS_META } from "../model/class-meta";
import { cn, ipaToRtgs, tint } from "@/shared/lib";

interface Props {
  unit: InitialUnit;
  size?: "sm" | "md";
  selected?: boolean;
  phonetic?: boolean;
  /** Chữ ít dùng: nền nhạt đi, chữ vẫn rõ */
  muted?: boolean;
  className?: string;
}

export function InitialFace({
  unit,
  size = "md",
  selected,
  phonetic = true,
  muted,
  className,
}: Props) {
  const { color, ink } = CLASS_META[unit.cls];
  return (
    <span
      className={cn(
        "relative flex flex-col items-center justify-center border-2",
        selected
          ? `${CLASS_META[unit.cls].bg} border-transparent text-on-accent`
          : "bg-transparent",
        size === "md"
          ? "h-20 min-w-16 px-2"
          : phonetic
            ? "h-11 min-w-11 px-1 short:h-10 short:min-w-10"
            : "size-11 px-1 short:size-10",
        className,
      )}
      style={
        selected
          ? undefined
          : { borderColor: tint(color, muted ? 35 : 55), color: ink }
      }
    >
      <span lang="th"
        className={cn(
          "font-thai leading-none",
          size === "md" ? "text-3xl" : "text-2xl",
        )}
      >
        {unit.chars}
      </span>
      {phonetic && (
        <span className="mt-0.5 text-xs leading-none opacity-90">
          <span className="font-ipa">/{unit.ipa}/</span> {ipaToRtgs(unit.ipa)}
        </span>
      )}
    </span>
  );
}
