"use client";
import { useEffect, useState } from "react";
import { setCookie } from "./cookie";

import type { Theme } from "@abugikha/core";

export type { Theme };

export function getEffectiveTheme(): Theme {
  const attr = document.documentElement.dataset.theme;
  if (attr === "light" || attr === "dark") return attr;
  const saved = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("theme="))
    ?.slice("theme=".length);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  setCookie("theme", theme);
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
