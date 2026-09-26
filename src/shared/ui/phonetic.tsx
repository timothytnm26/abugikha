import { ipaToRtgs } from "../lib/romanize";
import { cn } from "../lib/cn";

/** IPA đặt cạnh phiên âm RTGS. */
export function Phonetic({ ipa, className, style }: { ipa: string; className?: string; style?: React.CSSProperties }) {
  const rtgs = ipaToRtgs(ipa);
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2", className)} style={style}>
      <span className="font-ipa">/{ipa}/</span>
      {rtgs && (
        <span className="text-[0.8em] tracking-wide opacity-80" title="RTGS">
          {rtgs}
        </span>
      )}
    </span>
  );
}
