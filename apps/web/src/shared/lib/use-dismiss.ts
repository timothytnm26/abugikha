"use client";
import { useEffect, type RefObject } from "react";

/** Đóng popover khi bấm ra ngoài hoặc nhấn Esc (trả focus về nút mở). */
export function useDismiss(open: boolean, close: () => void, refs: RefObject<HTMLElement | null>[], returnFocus?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      close();
      returnFocus?.current?.focus();
    };
    const onDown = (e: MouseEvent) => {
      if (!refs.some((r) => r.current?.contains(e.target as Node))) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open, close, refs, returnFocus]);
}
