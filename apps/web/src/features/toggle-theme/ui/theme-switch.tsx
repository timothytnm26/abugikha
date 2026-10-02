"use client";
import { usePreferences } from "@/shared/lib/preferences";
import { useT } from "@/shared/i18n";

/** Nút nhanh sáng ⇄ tối, độc lập với skin đang chọn. */
export function ThemeSwitch() {
  const t = useT();
  const theme = usePreferences((p) => p.theme);
  const setTheme = usePreferences((p) => p.setTheme);
  const next = theme === "dark" ? "light" : "dark";
  const label = next === "dark" ? t.nav.toDark : t.nav.toLight;
  return (
    <button type="button" onClick={() => setTheme(next)} aria-label={label} title={label} className="nav-btn">
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
