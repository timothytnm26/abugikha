import { TONE_META, type Tone } from "../model/tone";

/** Đường nét thanh điệu theo thang Chao 1–5. */
export function ToneContour({ tone, className, strokeWidth = 3, color }: { tone: Tone; className?: string; strokeWidth?: number; color?: string }) {
  const pts = TONE_META[tone].chao;
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${4 + (i * 32) / (pts.length - 1)},${4 + (5 - p) * 6}`).join(" ");
  return (
    <svg viewBox="0 0 40 32" className={className} aria-hidden>
      <path d={d} fill="none" stroke={color ?? TONE_META[tone].color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
