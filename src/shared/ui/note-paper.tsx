import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

/**
 * Tờ giấy ghi chú cho khung xem trước. Kiểu kẻ (ngang / ô vuông / chấm / trơn) do người dùng chọn
 * trong Tuỳ chỉnh và được CSS đọc từ `data-paper` trên <html>, nên component này không cần state.
 */
export function NotePaper({ className, tape = true, fold = true, ...rest }: ComponentProps<"div"> & { tape?: boolean; fold?: boolean }) {
  return <div data-tape={tape ? "" : undefined} data-fold={fold ? "" : undefined} className={cn("note-paper rounded-2xl", className)} {...rest} />;
}
