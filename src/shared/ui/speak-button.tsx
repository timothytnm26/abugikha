"use client";
import { speakThai } from "../lib/speech";
import { cn } from "../lib/cn";
import { useT } from "../i18n";

export function SpeakButton({ text, label, className }: { text: string; label?: string; className?: string }) {
  const t = useT();
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speakThai(text);
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1 text-sm font-medium hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
        className,
      )}
    >
      <svg aria-hidden viewBox="0 0 20 20" className="size-4 fill-current">
        <path d="M3 8v4h3l4 4V4L6 8H3zm10.5 2a3.5 3.5 0 0 0-2-3.2v6.4a3.5 3.5 0 0 0 2-3.2zM11.5 3v1.6a5.5 5.5 0 0 1 0 10.8V17a7 7 0 0 0 0-14z" />
      </svg>
      {label ?? t.common.listen}
    </button>
  );
}
