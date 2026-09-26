"use client";
import { useEffect, useState } from "react";
import { applyTheme, getEffectiveTheme, type Theme } from "@/shared/lib/theme";
import { useT } from "@/shared/i18n";

export function ThemeSwitch() {
  const t = useT();
  const [theme, setTheme] = useState<Theme | null>(null);
  useEffect(() => setTheme(getEffectiveTheme()), []);
  const next: Theme = theme === "dark" ? "light" : "dark";
  const label = next === "dark" ? t.nav.toDark : t.nav.toLight;
  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(next);
        setTheme(next);
      }}
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center rounded-full border border-ink/15 hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      {theme === "dark" ? (
        <svg aria-hidden viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg aria-hidden viewBox="0 0 24 24" className="size-4 fill-current">
          <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
        </svg>
      )}
    </button>
  );
}
