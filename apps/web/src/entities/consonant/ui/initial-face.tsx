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
  const color = CLASS_META[unit.cls].color;
  return (
    <span
      className={cn(
        "relative flex flex-col items-center justify-center rounded-lg border-2",
        selected
          ? `${CLASS_META[unit.cls].bg} border-transparent text-on-accent`
          : "bg-transparent",
        size === "md"
          ? "h-20 min-w-16 px-2"
          : phonetic
            ? "h-11 min-w-11 px-1"
            : "size-11 px-1",
        className,
      )}
      style={
        selected
          ? undefined
          : { borderColor: tint(color, muted ? 35 : 55), color }
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
        <span className="mt-0.5 text-[10px] leading-none opacity-90">
          <span className="font-ipa">/{unit.ipa}/</span> {ipaToRtgs(unit.ipa)}
        </span>
      )}
    </span>
  );
}
