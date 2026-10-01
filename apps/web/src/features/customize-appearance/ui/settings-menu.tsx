"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CLASS_META, type ConsonantClass } from "@abugikha/core/consonant";
import { TONE_META, type Tone } from "@abugikha/core/syllable";
import { CLASS_KEYS, PAPER_STYLES, PART_KEYS, TONE_KEYS, type PaletteKey } from "@/shared/config/palette";
import { THEMES, THEME_BY_ID, DEFAULT_THEME, type ThemeDef, type ThemeMode } from "@/shared/config/themes";
import { usePreferences } from "@/shared/lib/preferences";
import { useEffectiveTheme } from "@/shared/lib/theme";
import { useDismiss } from "@/shared/lib/use-dismiss";
import { fmt, useLocale, useT, type L10n } from "@/shared/i18n";
import { gsap, useGSAP, prefersReducedMotion } from "@/shared/lib/gsap";
import { cn } from "@/shared/lib";

/** Ký tự đại diện cho từng khoá màu: phụ âm mẫu của nhóm, nguyên âm, âm cuối, hoặc dấu thanh trên ◌ (thanh sắc-thường không có dấu). */
const GLYPH: Record<PaletteKey, string> = {
  mid: "ก", high: "ข", low: "ค",
  "part-vowel": "า", "part-final": "น",
  "tone-mid": "◌", "tone-low": "◌่", "tone-falling": "◌้", "tone-high": "◌๊", "tone-rising": "◌๋",
};

/** Nhãn của khoá palette: tên nhóm phụ âm, tên thanh điệu hoặc vai trò nguyên âm / âm cuối */
const labelOf = (k: PaletteKey, t: ReturnType<typeof useT>): L10n | string =>
  k.startsWith("tone-")
    ? TONE_META[k.slice("tone-".length) as Tone].label
    : k === "part-vowel"
      ? t.settings.vowelColor
      : k === "part-final"
        ? t.settings.finalColor
        : CLASS_META[k as ConsonantClass].label;

function Switch({ on, set, className, label }: { on: boolean; set: (v: boolean) => void; className?: string; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => set(!on)} className={cn("flex min-h-11 items-center gap-2 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink", className)}>
      <span className={cn("relative h-5 w-9 shrink-0 rounded-full transition-colors", on ? "bg-ink" : "bg-ink/20")}>
        <span className={cn("absolute top-0.5 size-4 rounded-full bg-paper shadow transition-[left]", on ? "left-4.5" : "left-0.5")} />
      </span>
      {label}
    </button>
  );
}

export function PhoneticSwitch(props: { className?: string; label: string }) {
  const on = usePreferences((s) => s.showPhonetic);
  const set = usePreferences((s) => s.setShowPhonetic);
  return <Switch on={on} set={set} {...props} />;
}

/** Bật/tắt tự đọc âm tiết khi ghép chữ */
export function AutoSpeakSwitch(props: { className?: string; label: string }) {
  const on = usePreferences((s) => s.autoSpeak);
  const set = usePreferences((s) => s.setAutoSpeak);
  return <Switch on={on} set={set} {...props} />;
}

function ThemeCard({ theme, selected, onPick }: { theme: ThemeDef; selected: boolean; onPick: () => void }) {
  const t = useT();
  const v = theme.vars;
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={selected}
      className={cn("flex flex-col gap-2 rounded-2xl border-2 p-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink", selected ? "border-ink" : "border-ink/10 hover:border-ink/30")}
    >
      <span className="flex h-11 items-center gap-1.5 rounded-xl px-2.5" style={{ backgroundColor: v.paper }}>
        <span lang="th" className="font-thai text-lg leading-none" style={{ color: v.ink }}>ก</span>
        {(["mid", "high", "low", "part-vowel", "part-final"] as const).map((k) => (
          <span lang="th" key={k} className="font-thai text-base leading-none" style={{ color: v[k] }}>{GLYPH[k]}</span>
        ))}
        <span className="ml-auto h-6 w-5 rounded-sm" style={{ backgroundColor: v.sheet, boxShadow: `inset 0 -3px 0 -1px ${v["sheet-line"]}` }} />
      </span>
      <span className="text-xs font-medium">{t.settings.themes[theme.id]}</span>
    </button>
  );
}

/** Ví dụ ค้าน tô đúng màu từng phần, đổi màu là thấy ngay. */
function Sample() {
  const t = useT();
  return (
    <div className="note-paper flex items-center justify-between gap-3 rounded-2xl px-4 py-2" data-tape>
      <span className="text-xs text-ink-soft">{t.settings.sample}</span>
      <span lang="th" className="note-glyph font-thai text-4xl leading-normal" aria-hidden>
        <span className="text-low">ค</span>
        <span className="text-tone-high">้</span>
        <span className="text-part-vowel">า</span>
        <span className="text-part-final">น</span>
      </span>
    </div>
  );
}

export function SettingsMenu() {
  const t = useT();
  const { locale } = useLocale();
  const mode = useEffectiveTheme() ?? "light";
  const { themeId, palette, paper, setTheme, setColor, resetPalette, setPaper } = usePreferences();
  const activeId = themeId ?? DEFAULT_THEME[mode];
  const active = THEME_BY_ID.get(activeId)!;
  const overrides = palette[activeId] ?? {};
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const refs = useRef([panel, button]).current;
  useDismiss(open, close, refs, button);

  // Trên màn hình nhỏ: cuộn trang phía sau bị khoá khi bảng tuỳ chỉnh mở
  useEffect(() => {
    if (!open) return;
    const small = matchMedia("(max-width: 639px)").matches;
    if (!small) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Mở bảng thì đưa focus vào trong; Tab xoay vòng trong bảng, Esc đóng và trả focus về nút mở
  useEffect(() => {
    if (!open) return;
    const el = panel.current;
    if (!el) return;
    const items = () => [...el.querySelectorAll<HTMLElement>('button, input, summary, [href], [tabindex]:not([tabindex="-1"])')].filter((n) => !n.hasAttribute("disabled"));
    (items()[0] ?? el).focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const list = items();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === el)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    el.addEventListener("keydown", trap);
    return () => el.removeEventListener("keydown", trap);
  }, [open, mounted]);

  useGSAP(
    () => {
      if (!open || prefersReducedMotion()) return;
      const sheet = matchMedia("(max-width: 639px)").matches;
      gsap.fromTo(panel.current, sheet ? { yPercent: 12, opacity: 0 } : { y: -8, opacity: 0, scale: 0.97 }, sheet ? { yPercent: 0, opacity: 1, duration: 0.28, ease: "power3.out" } : { y: 0, opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" });
    },
    { dependencies: [open] },
  );

  const label = (k: PaletteKey) => {
    const l = labelOf(k, t);
    return typeof l === "string" ? l : l[locale];
  };
  const swatches = (keys: readonly PaletteKey[]) => (
    <div className={"grid grid-cols-5 gap-2"}>
      {keys.map((k) => (
        <label key={k} className="flex flex-col items-center gap-1 text-xs text-ink-soft">
          <span lang="th" className="font-thai relative grid size-11 place-items-center overflow-hidden rounded-xl bg-sheet text-2xl leading-none ring-2 ring-ink/10 focus-within:ring-ink sm:size-10" style={{ color: `var(--color-${k})` }}>
            {GLYPH[k]}
            <input type="color" value={overrides[k] ?? active.vars[k]} onChange={(e) => setColor(activeId, k, e.target.value)} className="absolute inset-0 size-full cursor-pointer opacity-0" aria-label={label(k)} />
          </span>
          {label(k)}
        </label>
      ))}
    </div>
  );

  const themeGroup = (m: ThemeMode, title: string) => (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-ink-soft">{title}</p>
      <div className="grid grid-cols-2 gap-2">
        {THEMES.filter((th) => th.mode === m).map((th) => (
          <ThemeCard key={th.id} theme={th} selected={th.id === activeId} onPick={() => setTheme(th.id)} />
        ))}
      </div>
    </div>
  );

  const body = (
    <>
      <div className="fixed inset-0 z-[60] bg-ink/40 sm:hidden" aria-hidden />
      <div
        ref={panel}
        id="settings-panel"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-label={t.settings.title}
        className="fixed inset-x-0 bottom-0 z-[70] max-h-[88dvh] outline-none space-y-6 overflow-y-auto overscroll-contain rounded-t-3xl border border-ink/10 bg-paper p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-[3.75rem] sm:max-h-[calc(100dvh-5rem)] sm:w-[25rem] sm:rounded-3xl md:right-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t.settings.title}</h2>
          <button type="button" onClick={close} className="grid size-11 place-items-center rounded-full border border-ink/15 hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink" aria-label={t.settings.close}>
            <svg aria-hidden viewBox="0 0 24 24" className="size-4 stroke-current stroke-2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <section className="space-y-3" aria-label={t.settings.themeTitle}>
          <div>
            <h3 className="text-sm font-semibold">{t.settings.themeTitle}</h3>
            <p className="text-xs text-ink-soft">{t.settings.themeHint}</p>
          </div>
          {themeGroup("light", t.settings.lightGroup)}
          {themeGroup("dark", t.settings.darkGroup)}
        </section>

        <section className="space-y-3" aria-label={t.settings.paperTitle}>
          <div>
            <h3 className="text-sm font-semibold">{t.settings.paperTitle}</h3>
            <p className="text-xs text-ink-soft">{t.settings.paperHint}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {PAPER_STYLES.map((p) => (
              <button key={p} type="button" aria-pressed={paper === p} onClick={() => setPaper(p)} className={cn("flex flex-col items-center gap-1.5 rounded-2xl border-2 p-2 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink", paper === p ? "border-ink" : "border-ink/10 hover:border-ink/30")}>
                <span data-style={p} className="note-paper block h-12 w-full rounded-lg [--u:0.75rem]" />
                {t.settings.paper[p]}
              </button>
            ))}
          </div>
        </section>

        <details className="group space-y-3">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
            <span>
              <h3 className="text-sm font-semibold">{t.settings.partColors}</h3>
              <span className="block text-xs text-ink-soft">{t.settings.partColorsHint}</span>
            </span>
            <svg aria-hidden viewBox="0 0 20 20" className="size-4 shrink-0 fill-none stroke-current stroke-2 transition-transform group-open:rotate-180" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 8l5 5 5-5" />
            </svg>
          </summary>
          <Sample />
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-ink-soft">{t.settings.initialColors}</p>
            {swatches(CLASS_KEYS)}
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-ink-soft">{t.settings.vowelColor} · {t.settings.finalColor}</p>
            {swatches(PART_KEYS)}
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-ink-soft">{t.settings.markColors}</p>
            {swatches(TONE_KEYS)}
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-ink/10 pt-3 text-xs text-ink-soft">
            <span>{fmt(t.settings.perTheme, { theme: t.settings.themes[active.id] })}</span>
            <button type="button" onClick={() => resetPalette(activeId)} className="shrink-0 rounded-full border border-ink/15 px-3 py-2 font-medium text-ink hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
              {t.settings.reset}
            </button>
          </div>
        </details>

        <div className="space-y-4 border-t border-ink/10 pt-4">
          <div>
            <PhoneticSwitch label={t.settings.phonetic} className="text-sm" />
            <p className="mt-1 pl-11 text-xs text-ink-soft">{t.settings.phoneticHint}</p>
          </div>
          <div>
            <AutoSpeakSwitch label={t.settings.autoSpeak} className="text-sm" />
            <p className="mt-1 pl-11 text-xs text-ink-soft">{t.settings.autoSpeakHint}</p>
          </div>
        </div>
      </div>
    </>
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
        className="grid size-11 place-items-center rounded-full border border-ink/15 hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <svg aria-hidden viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2" strokeLinecap="round">
          <circle cx="7" cy="8" r="2.5" /><circle cx="16" cy="8" r="2.5" /><circle cx="11.5" cy="16" r="2.5" />
          <path d="M9.5 8h4M8.5 10.3l1.8 3.4M14.7 10.3l-1.8 3.4" />
        </svg>
      </button>
      {/* Đưa ra <body>: thanh nav có backdrop-filter nên sẽ nhốt phần tử fixed bên trong */}
      {open && mounted && createPortal(body, document.body)}
    </div>
  );
}
