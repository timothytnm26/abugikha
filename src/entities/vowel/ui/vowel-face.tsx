import type { Vowel } from "../model/types";
import { vowelGlyph } from "../model/data";
import { cn, ipaToRtgs } from "@/shared/lib";

export function VowelFace({
  vowel,
  form = "open",
  size = "md",
  selected,
  phonetic = true,
  holder,
  className,
}: {
  vowel: Vowel;
  form?: "open" | "closed";
  size?: "sm" | "md";
  selected?: boolean;
  phonetic?: boolean;
  holder?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border-2 px-2",
        size === "md"
          ? "h-20 min-w-16"
          : phonetic
            ? "h-11 min-w-11 px-1"
            : "size-10 px-1",
        selected
          ? "border-transparent bg-ink text-paper"
          : "border-dashed border-ink/30 bg-transparent text-ink",
        !selected && vowel.length === "long" && "border-solid",
        className,
      )}
    >
      <span
        className={cn(
          "font-thai leading-none",
          size === "md" ? "text-3xl" : "text-2xl",
        )}
      >
        {vowelGlyph(vowel, form, holder)}
      </span>
      {phonetic && (
        <span
          className={cn(
            "mt-0.5 text-[10px] leading-none",
            selected ? "text-paper/80" : "text-ink-soft",
          )}
        >
          <span className="font-ipa">/{vowel.ipa}/</span> {ipaToRtgs(vowel.ipa)}
        </span>
      )}
    </span>
  );
}
