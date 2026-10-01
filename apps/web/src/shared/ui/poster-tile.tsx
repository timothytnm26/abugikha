"use client";
import Link from "next/link";
import type { CSSProperties, ComponentProps, ReactNode, RefObject } from "react";
import { THEME_BY_ID } from "../config/themes";
import { cn } from "../lib/cn";

export type PosterBg = "blue" | "lime" | "violet" | "black" | "orange" | "red" | "cream" | "green" | "pink";

/** Mỗi nền đi kèm đúng màu chữ đã kiểm tra AA ở shared/config/poster.test.ts; đừng ghép cặp khác. */
const TILE: Record<PosterBg, string> = {
  blue: "bg-poster-blue text-white",
  lime: "bg-poster-lime text-poster-black",
  violet: "bg-poster-violet text-white",
  black: "bg-poster-black text-poster-lime",
  orange: "bg-poster-orange text-poster-black",
  red: "bg-poster-red text-poster-black",
  cream: "bg-poster-cream text-poster-black",
  green: "bg-poster-green text-white",
  pink: "bg-poster-pink text-poster-black",
};

/**
 * Ô nền sáng cố định chứa nội dung tô màu theo giao diện (chữ Thái đổi màu theo nhóm phụ âm, thanh...): đặt lại các biến màu về
 * giao diện celadon để ở dark mode chữ vẫn đọc được trên nền kem.
 */
export const LIGHT_VARS = Object.fromEntries(Object.entries(THEME_BY_ID.get("celadon")!.vars).map(([k, v]) => [`--color-${k}`, v])) as CSSProperties;

interface BaseProps {
  bg: PosterBg;
  /** Dùng khi ô chứa nội dung tô màu theo giao diện */
  themed?: boolean;
  /** Đệm của ô; mặc định p-5 md:p-8. Truyền chuỗi riêng để thay hẳn (không chồng hai bộ p-* lên nhau). */
  pad?: string;
  className?: string;
  children: ReactNode;
}

/** Một ô phẳng của lưới áp phích: vuông góc, không viền, không bóng. */
export function PosterTile({ bg, themed, pad = "p-5 md:p-8", className, children, style, id }: BaseProps & { style?: CSSProperties; id?: string }) {
  return (
    <div data-tile id={id} className={cn(pad, TILE[bg], className)} style={themed ? { ...LIGHT_VARS, ...style } : style}>
      {children}
    </div>
  );
}

/** Ô là một liên kết: hover nhích mũi tên (do con tự làm), focus vẽ khung đen-chanh đủ thấy trên mọi nền. */
export function PosterLink({ bg, themed, pad = "p-5 md:p-8", className, children, style, ...rest }: BaseProps & Omit<ComponentProps<typeof Link>, keyof BaseProps>) {
  return (
    <Link
      data-tile
      className={cn("group block focus-visible:outline-4 focus-visible:-outline-offset-8 focus-visible:outline-poster-black", pad, TILE[bg], bg === "black" && "focus-visible:outline-poster-lime", className)}
      style={themed ? { ...LIGHT_VARS, ...style } : style}
      {...rest}
    >
      {children}
    </Link>
  );
}

/** Ô kem cho khung chi tiết đang chọn: nền sáng cố định, màu theo giao diện đặt lại về celadon để dark mode vẫn đọc được. */
export const CREAM_PANEL = "bg-poster-cream text-poster-black";

/** Dải tiêu đề của một phần nội dung: một ô màu tràn hết chiều ngang phía trên nội dung, chữ condensed viết hoa. */
export function PosterHeading({ bg, id, as: Tag = "h2", children }: { bg: PosterBg; id?: string; as?: "h2" | "h3"; children: ReactNode }) {
  return (
    <PosterTile bg={bg} pad="py-3 md:py-4">
      <div className="page-container">
        <Tag id={id} className="font-poster text-3xl font-extrabold uppercase leading-none md:text-5xl">
          {children}
        </Tag>
      </div>
    </PosterTile>
  );
}

/** Khung ngoài của một lưới ô: vuông góc, không bóng; chỉ gom các ô khít nhau không khe. */
export function PosterFrame({ className, children, ref }: { className?: string; children: ReactNode; ref?: RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={ref}
      className={cn("overflow-hidden", className)}
    >
      {children}
    </div>
  );
}

/** Ba mũi tên >>> như trên áp phích: nhấn mạnh nút hành động chính. */
export function Chevrons({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 48 16" className={cn("h-4 w-12 fill-none stroke-current stroke-[3]", className)} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2l6 6-6 6M17 2l6 6-6 6M31 2l6 6-6 6" />
    </svg>
  );
}
