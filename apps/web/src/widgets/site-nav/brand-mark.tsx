"use client";
import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/shared/lib/gsap";
import { cn } from "@/shared/lib";

type Script = "thai" | "latin";

/** Mỗi phần tử là một cụm hiển thị (chữ Thái gồm cả dấu), từ `brandFrom` trở đi được nhấn màu. */
const WORDS: Record<Script, { tokens: string[]; brandFrom: number }> = {
  thai: { tokens: ["น่", "า", "รั", "ก", "ไ", "ท", "ย"], brandFrom: 4 },
  latin: { tokens: [..."NarakThai"], brandFrom: 5 },
};
const HOLD_MS = 3600;
const SCRAMBLE_MS = 400;
const STAGGER_MS = 60;
const SETTLE_MS = 350;
const FRAME_MS = 50;

type Token = { text: string; script: Script };

/** Logo luân phiên giữa "น่ารักไทย" và "NarakThai" bằng hiệu ứng giải mã từng ký tự. */
export function BrandMark() {
  const [view, setView] = useState<Token[]>(
    WORDS.thai.tokens.map((text) => ({ text, script: "thai" })),
  );

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let raf = 0;
    let timer = 0;
    let current: Script = "thai";

    const run = () => {
      const from = WORDS[current].tokens;
      const next: Script = current === "thai" ? "latin" : "thai";
      const target = WORDS[next].tokens;
      const len = Math.max(from.length, target.length);
      const total = SCRAMBLE_MS + len * STAGGER_MS + SETTLE_MS;
      const start = performance.now();
      let last = 0;

      const tick = (now: number) => {
        const elapsed = now - start;
        const done = elapsed >= total;
        if (done || now - last >= FRAME_MS) {
          last = now;
          const tokens: Token[] = [];
          for (let i = 0; i < len; i++) {
            const reveal = SCRAMBLE_MS + i * STAGGER_MS;
            const settled = done || elapsed >= reveal + SETTLE_MS;
            // Chỉ xen kẽ giữa ký tự cũ và ký tự mới của đúng hai chữ, không chèn ký tự lạ.
            const showNew = settled || (elapsed >= SCRAMBLE_MS * 0.5 && Math.random() < 0.5);
            const text = showNew ? target[i] : from[i];
            if (text !== undefined) tokens.push({ text, script: showNew ? next : current });
          }
          setView(tokens);
        }
        if (done) {
          current = next;
          timer = window.setTimeout(run, HOLD_MS);
          return;
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    timer = window.setTimeout(run, HOLD_MS);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <span aria-hidden className="whitespace-nowrap text-xl font-semibold sm:text-2xl">
      {view.map((tok, i) => (
        <span
          key={i}
          lang={tok.script === "thai" ? "th" : "en"}
          className={cn(
            tok.script === "thai" ? "font-thai" : "font-poster uppercase tracking-wide",
            i >= WORDS[tok.script].brandFrom ? "text-brand" : "text-pastel",
          )}
        >
          {tok.text}
        </span>
      ))}
    </span>
  );
}
