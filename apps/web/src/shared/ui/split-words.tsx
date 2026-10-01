"use client";
import { Fragment } from "react";
import { cn } from "../lib/cn";

/**
 * Tách câu thành từng từ nằm trong một ô che (overflow-hidden) để chữ trồi lên từng từ; `className` áp cho mỗi từ bên trong.
 * Ô che có đệm trên dưới (rồi kéo lại bằng lề âm) để dấu thanh tiếng Việt không bị cắt, và dấu cách nằm ngoài ô che để không bị nuốt.
 */
export function SplitWords({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <Fragment key={i}>
          <span className="-my-[0.3em] inline-block overflow-hidden py-[0.3em] align-bottom">
            <span className={cn("sw inline-block will-change-transform", className)}>{w}</span>
          </span>{" "}
        </Fragment>
      ))}
    </>
  );
}

/** Tách câu thành từng từ riêng biệt để một hiệu ứng cuộn có thể làm sáng dần từng từ (class `mw`). */
export function ScrubWords({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} className="mw inline-block">
          {w}
          {" "}
        </span>
      ))}
    </>
  );
}
