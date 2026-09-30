import { CLASS_META } from "../../consonant/@x/syllable";
import { TONE_META } from "../model/tone";
import type { SyllableAnalysis } from "../model/types";
import { cn } from "@/shared/lib";

export function SyllableGlyph({
  analysis,
  className,
}: {
  analysis: SyllableAnalysis;
  className?: string;
}) {
  const classColor = CLASS_META[analysis.cls].color;
  const toneColor = TONE_META[analysis.tone].color;
  return (
    <span className={cn("font-thai", className)}>
      {analysis.segments.map((segment, index) => {
        const color =
          segment.role === "initial"
            ? classColor
            : segment.role === "mark"
              ? toneColor
              : segment.role === "vowel"
                ? "var(--color-vowel)"
                : "var(--color-final)";
        return (
          <span key={index} style={{ color }}>
            {segment.text}
          </span>
        );
      })}
    </span>
  );
}

export function SyllableCard({
  analysis,
  size = "md",
  className,
}: {
  analysis: SyllableAnalysis;
  size?: "md" | "lg";
  className?: string;
}) {
  const toneColor = TONE_META[analysis.tone].color;
  return (
    <span
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl bg-paper",
        size === "lg"
          ? "min-h-28 min-w-32 border-4 px-4 py-2"
          : "h-28 min-w-24 border-4 px-3",
        className,
      )}
      style={{ borderColor: toneColor }}
    >
      <SyllableGlyph
        analysis={analysis}
        className={cn("leading-[1.3]", size === "lg" ? "text-5xl" : "text-4xl")}
      />
    </span>
  );
}
