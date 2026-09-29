"use client";
import { useCallback, useRef, useState } from "react";
import { CLASS_KEYS, DEFAULT_PALETTE, TONE_KEYS, type PaletteKey } from "@/shared/config/palette";
import { usePreferences } from "@/shared/lib/preferences";
import { useEffectiveTheme } from "@/shared/lib/theme";
import { useDismiss } from "@/shared/lib/use-dismiss";
import { fmt, useLocale, useT, type L10n } from "@/shared/i18n";
import { gsap, useGSAP, prefersReducedMotion } from "@/shared/lib/gsap";
import { cn } from "@/shared/lib";

const LABELS: Record<PaletteKey, L10n> = {
  mid: { vi: "Trung", en: "Mid" }, high: { vi: "Cao", en: "High" }, low: { vi: "Thấp", en: "Low" },
  "tone-mid": { vi: "Ngang", en: "Mid" }, "tone-low": { vi: "Trầm", en: "Low" }, "tone-falling": { vi: "Rơi", en: "Falling" },
  "tone-high": { vi: "Cao", en: "High" }, "tone-rising": { vi: "Vút", en: "Rising" },
};

export function PhoneticSwitch({ className, label }: { className?: string; label: string }) {
  const on = usePreferences((s) => s.showPhonetic);
  const set = usePreferences((s) => s.setShowPhonetic);
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => set(!on)} className={cn("flex items-center gap-2 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink", className)}>
      <span className={cn("relative h-5 w-9 shrink-0 rounded-full transition-colors", on ? "bg-ink" : "bg-ink/20")}>
        <span className={cn("absolute top-0.5 size-4 rounded-full bg-paper shadow transition-[left]", on ? "left-4.5" : "left-0.5")} />
      </span>
      {label}
    </button>
  );
}

export function SettingsMenu() {
  const t = useT();
  const { locale } = useLocale();
  const theme = useEffectiveTheme() ?? "light";
  const { palette, setColor, resetPalette } = usePreferences();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const refs = useRef([panel, button]).current;
  useDismiss(open, close, refs, button);

  useGSAP(
    () => {
      if (!open || prefersReducedMotion()) return;
      gsap.fromTo(panel.current, { y: -8, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" });
    },
    { dependencies: [open] },
  );

  const row = (keys: readonly PaletteKey[]) => (
    <div className="grid grid-cols-5 gap-2">
      {keys.map((k) => {
        const value = palette[theme][k] ?? DEFAULT_PALETTE[theme][k];
        return (
          <label key={k} className="flex flex-col items-center gap-1 text-[11px] text-ink-soft">
            <span className="relative size-9 overflow-hidden rounded-full ring-2 ring-ink/10 focus-within:ring-ink" style={{ backgroundColor: `var(--color-${k})` }}>
              <input type="color" value={value} onChange={(e) => setColor(theme, k, e.target.value)} className="absolute inset-0 size-full cursor-pointer opacity-0" aria-label={LABELS[k][locale]} />
            </span>
            {LABELS[k][locale]}
          </label>
        );
      })}
    </div>
  );

  return (
    <div className="relative">
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="settings-panel"
        aria-label={t.nav.settings}
        title={t.nav.settings}
        className="grid size-9 place-items-center rounded-full border border-ink/15 hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <svg aria-hidden viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2" strokeLinecap="round">
          <circle cx="7" cy="8" r="2.5" /><circle cx="16" cy="8" r="2.5" /><circle cx="11.5" cy="16" r="2.5" />
          <path d="M9.5 8h4M8.5 10.3l1.8 3.4M14.7 10.3l-1.8 3.4" />
        </svg>
      </button>
      {open && (
        <div ref={panel} id="settings-panel" role="dialog" aria-label={t.settings.title} className="absolute right-0 top-full z-50 mt-2 w-[19rem] origin-top-right space-y-5 rounded-3xl border border-ink/10 bg-paper p-5 shadow-2xl">
          <div>
            <PhoneticSwitch label={t.settings.phonetic} className="text-sm" />
            <p className="mt-1 pl-11 text-xs text-ink-soft">{t.settings.phoneticHint}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold">{t.settings.classColors}</p>
            {row(CLASS_KEYS)}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold">{t.settings.toneColors}</p>
            {row(TONE_KEYS)}
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-ink/10 pt-3 text-xs text-ink-soft">
            <span>{fmt(t.settings.perTheme, { theme: theme === "dark" ? t.settings.dark : t.settings.light })}</span>
            <button type="button" onClick={() => resetPalette(theme)} className="shrink-0 rounded-full border border-ink/15 px-3 py-1 font-medium text-ink hover:bg-ink hover:text-paper">
              {t.settings.reset}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
