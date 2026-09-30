"use client";
import { useEffect, useState } from "react";

import type { Theme } from "@abugikha/core";

export type { Theme };

export function getEffectiveTheme(): Theme {
  const attr = document.documentElement.dataset.theme;
  if (attr === "light" || attr === "dark") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Theme đang hiển thị; cập nhật khi đổi data-theme hoặc khi hệ thống đổi chế độ. */
export function useEffectiveTheme(): Theme | null {
  const [theme, setTheme] = useState<Theme | null>(null);
  useEffect(() => {
    const update = () => setTheme(getEffectiveTheme());
    update();
    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", update);
    return () => {
      mo.disconnect();
      mq.removeEventListener("change", update);
    };
  }, []);
  return theme;
}
