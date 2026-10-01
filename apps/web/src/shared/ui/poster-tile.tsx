"use client";
import Link from "next/link";
import type { CSSProperties, ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";

export type PosterBg = "orange" | "blue" | "sky" | "lime" | "coral" | "violet" | "green" | "yellow" | "black" | "cream";

/** Mỗi nền đi kèm đúng màu chữ đã kiểm tra AA ở shared/config/poster.test.ts; đừng ghép cặp khác. */
const TILE: Record<PosterBg, string> = {
  orange: "bg-poster-orange text-poster-black",
  blue: "bg-poster-blue text-white",
  sky: "bg-poster-sky text-poster-black",
  lime: "bg-poster-lime text-poster-black",
  coral: "bg-poster-coral text-poster-black",
  violet: "bg-poster-violet text-white",
  green: "bg-poster-green text-poster-black",
  yellow: "bg-poster-yellow text-poster-black",
  black: "bg-poster-black text-poster-cream",
  cream: "bg-poster-cream text-poster-black",
};

interface BaseProps {
  bg: PosterBg;
  /** Đệm của ô; mặc định p-5 md:p-8. Truyền chuỗi riêng để thay hẳn (không chồng hai bộ p-* lên nhau). */
  pad?: string;
  className?: string;
  children: ReactNode;
}

/** Một khối màu phẳng: vuông góc, không viền, không bóng. Chỉ đặt chữ lên nó, không đặt nội dung tô màu theo giao diện. */
export function PosterTile({ bg, pad = "p-5 md:p-8", className, children, style, id }: BaseProps & { style?: CSSProperties; id?: string }) {
  return (
    <div id={id} className={cn(pad, TILE[bg], className)} style={style}>
      {children}
    </div>
  );
}

/** Khối màu là một liên kết: focus vẽ khung dày bên trong đủ thấy trên mọi nền. */
export function PosterLink({ bg, pad = "p-5 md:p-8", className, children, ...rest }: BaseProps & Omit<ComponentProps<typeof Link>, keyof BaseProps>) {
  return (
    <Link
      className={cn("group block focus-visible:outline-4 focus-visible:-outline-offset-8", bg === "black" || bg === "blue" || bg === "violet" ? "focus-visible:outline-white" : "focus-visible:outline-poster-black", pad, TILE[bg], className)}
      {...rest}
    >
      {children}
    </Link>
  );
}

/** Dấu sao tám cánh làm điểm nhấn nhỏ cạnh nhãn từng phần. */
export function Asterisk({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={cn("size-5 shrink-0 fill-none stroke-current stroke-[3]", className)} strokeLinecap="butt">
      <path d="M12 1v22M1 12h22M4.2 4.2l15.6 15.6M19.8 4.2L4.2 19.8" />
    </svg>
  );
}

/** Nhãn nhỏ của một phần: dấu sao cam và chữ condensed viết hoa. */
export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-center gap-2 font-poster text-xl font-bold uppercase leading-none", className)}>
      <Asterisk className="text-poster-orange" />
      {children}
    </p>
  );
}

/** Tiêu đề một phần của trang công cụ: nhãn có dấu sao và tít condensed lớn trên nền giấy, không tô khối màu. */
export function SectionHeading({ id, label, children }: { id?: string; label?: string; children: ReactNode }) {
  return (
    <div className="page-container pt-14 md:pt-24">
      {label && <SectionLabel>{label}</SectionLabel>}
      <h2 id={id} className="mt-3 text-balance font-poster text-5xl font-extrabold uppercase leading-[0.95] md:text-7xl">
        {children}
      </h2>
    </div>
  );
}

/** Khung hình tròn cam kiểu copula: bốn vòng, vòng nào đang chọn thì đặc, còn lại rỗng. Chỉ để trang trí. */
export function Circles({ active, className }: { active?: number; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 200 200" className={cn("w-full max-w-xs text-poster-orange", className)}>
      {[0, 1, 2, 3].map((i) => {
        const cx = 50 + (i % 2) * 100;
        const cy = 50 + Math.floor(i / 2) * 100;
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={active === i ? 49 : 41}
            fill={active === undefined || active === i ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={active === undefined || active === i ? 0 : 8}
            style={{ transition: "r 300ms cubic-bezier(0.16, 1, 0.3, 1), fill 300ms" }}
          />
        );
      })}
    </svg>
  );
}
