"use client";
import type { RefObject } from "react";
import { gsap, useGSAP } from "./gsap";

/** Các ô [data-tile] trong `root` hiện dần theo thứ tự khi cuộn tới; bỏ qua nếu người dùng chọn giảm chuyển động. */
export function useTileReveal(root: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current;
        if (!el) return;
        gsap.from(el.querySelectorAll("[data-tile]"), {
          opacity: 0,
          y: 28,
          duration: 0.6,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%", once: true },
        });
      });
    },
    { scope: root },
  );
}
