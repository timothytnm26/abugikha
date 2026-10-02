"use client";
import { speakThai } from "../lib/speech";
import { cn } from "../lib/cn";
import { useT } from "../i18n";
import { SpeakerIcon } from "./speaker-icon";

/** `bare`: chỉ biểu tượng loa, không viền không nền, màu thương hiệu (hover mới hiện nền nhạt), tên dành cho trình đọc màn hình */
export function SpeakButton({ text, label, className, bare }: { text: string; label?: string; className?: string; bare?: boolean }) {
  const t = useT();
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speakThai(text);
      }}
      // label="" = chỉ có biểu tượng loa, vẫn cần tên cho trình đọc màn hình
      aria-label={bare || label === "" ? t.common.listen : undefined}
      title={bare ? t.common.listen : undefined}
      className={cn(
        bare
          ? "grid size-9 shrink-0 place-items-center text-brand hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          : "btn btn-outline btn-xs",
        className,
      )}
    >
      <SpeakerIcon />
      {!bare && (label ?? t.common.listen)}
    </button>
  );
}
