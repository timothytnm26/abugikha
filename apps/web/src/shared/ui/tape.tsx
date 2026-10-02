"use client";
import Link from "next/link";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "../lib/cn";

/** Số giả ngẫu nhiên ổn định từ một khoá: cùng khoá luôn cùng kết quả (dùng cho giá trị ban đầu để server và client khớp nhau) */
export const hashSeed = (key: string, salt = 0) => {
  let h = salt;
  for (const ch of key) h = (h * 31 + ch.codePointAt(0)!) >>> 0;
  return h;
};

const SEAM = (n: number, edge: "L" | "R") => {
  // Đường cắt răng cưa dọc một đầu băng, n răng
  const pts: string[] = [];
  for (let i = 0; i <= n * 2; i++) pts.push(`${edge === "L" ? (i % 2 ? 4 : 0) : i % 2 ? 96 : 100}% ${(i / (n * 2)) * 100}%`);
  return edge === "L" ? pts : pts.reverse();
};

/** 6 kiểu cắt đầu băng: răng cưa, cắt xéo, đuôi én, rách, bo tròn, một đầu răng cưa một đầu thẳng */
const TAPE_CUTS = [
  `polygon(${[...SEAM(4, "L"), ...SEAM(4, "R")].join(",")})`,
  "polygon(5% 0, 100% 0, 95% 100%, 0 100%)",
  "polygon(0 0, 100% 0, 96% 50%, 100% 100%, 0 100%, 4% 50%)",
  "polygon(0 8%, 3% 0, 6% 10%, 14% 0, 40% 6%, 62% 0, 85% 8%, 94% 0, 100% 12%, 97% 38%, 100% 62%, 96% 90%, 100% 100%, 80% 94%, 58% 100%, 34% 92%, 12% 100%, 4% 92%, 0 100%, 3% 66%, 0 40%, 4% 20%)",
  "inset(0 round 0.7rem)",
  `polygon(${[...SEAM(4, "L"), "100% 100%", "100% 0"].join(",")})`,
];
/** 6 hoạ tiết: sọc chéo, chấm, trơn, sọc ngang, ô vuông, sọc đứng */
const WHITE = "rgb(255 255 255 / 0.3)";
const TAPE_PATTERNS = [
  `repeating-linear-gradient(135deg, ${WHITE} 0 6px, transparent 6px 12px)`,
  `radial-gradient(${WHITE} 1.5px, transparent 2px) 0 0 / 10px 10px`,
  "none",
  `repeating-linear-gradient(0deg, ${WHITE} 0 3px, transparent 3px 8px)`,
  `conic-gradient(${WHITE} 25%, transparent 0 50%, ${WHITE} 0 75%, transparent 0) 0 0 / 12px 12px`,
  `repeating-linear-gradient(90deg, ${WHITE} 0 4px, transparent 4px 10px)`,
];

interface TapeProps {
  children: ReactNode;
  /** Màu băng (CSS color/var); chữ luôn là on-accent nên chọn màu sáng */
  color: string;
  /** Khoá cho kiểu cắt và hoạ tiết (và góc nếu không truyền `angle`). Bỏ trống = đổi ngẫu nhiên mỗi lần tải trang. */
  seed?: number;
  /** Góc xoay (độ, dương = theo chiều kim đồng hồ). Bỏ trống = nghiêng nhẹ -6° đến 6° theo seed. */
  angle?: number;
  /** Chữ nhỏ (nút trong khung) hay chữ lớn kiểu áp phích (nút ở trang chủ) */
  size?: "sm" | "lg";
  /** Quay quanh đầu phải và nhô ra ngoài mép khung (dùng khi dán lên mép khung) */
  pinned?: boolean;
  className?: string;
  onClick?: () => void;
  href?: string;
}

/**
 * Nút kiểu băng keo washi: màu hơi trong, hoạ tiết mờ, hai đầu cắt theo một trong 6 kiểu.
 * Là `<button>` hoặc liên kết (khi có `href`). Ngẫu nhiên ở client sau khi hiện, giá trị đầu tiên cố định để không lệch hydration.
 */
export function Tape({ children, color, seed, angle, size = "sm", pinned, className, onClick, href }: TapeProps) {
  const [rand, setRand] = useState(() => hashSeed(String(children)));
  useEffect(() => {
    if (seed === undefined) setRand(Math.floor(Math.random() * 2 ** 31));
  }, [seed]);
  const s = seed ?? rand;
  const deg = angle ?? (s % 13) - 6;
  const style = {
    clipPath: TAPE_CUTS[(s >>> 5) % TAPE_CUTS.length],
    rotate: `${deg}deg`,
    ...(pinned && { transformOrigin: "100% 50%", translate: "0.75rem 0" }),
    backgroundColor: `color-mix(in oklab, ${color} 88%, transparent)`,
    backgroundImage: TAPE_PATTERNS[(s >>> 9) % TAPE_PATTERNS.length],
  } satisfies CSSProperties;
  const cls = cn(
    "relative inline-flex w-max items-center justify-center gap-1.5 whitespace-nowrap font-semibold leading-tight text-on-accent drop-shadow-[0_1px_2px_rgb(0_0_0/0.25)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
    size === "lg" ? "min-h-12 px-10 py-3 font-poster text-xl font-bold uppercase tracking-wide" : "min-h-9 px-8 py-1.5 text-sm",
    className,
  );
  return href ? (
    <Link href={href} className={cls} style={style}>
      {children}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cls} style={style}>
      {children}
    </button>
  );
}
