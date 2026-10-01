"use client";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { useShallow } from "zustand/react/shallow";
import { CLASS_META, type ConsonantClass } from "@abugikha/core/consonant";
import { TONE_META, type Tone } from "@abugikha/core/syllable";
import { CLASS_KEYS, PAPER_STYLES, PART_KEYS, TONE_KEYS, type PaletteKey } from "@/shared/config/palette";
import { SKINS, SKIN_BY_ID, type SkinDef } from "@/shared/config/skins";
import { usePreferences } from "@/shared/lib/preferences";
import { useDismiss } from "@/shared/lib/use-dismiss";
import { fmt, useLocale, useT, type L10n } from "@/shared/i18n";
import { gsap, useGSAP, prefersReducedMotion } from "@/shared/lib/gsap";
import { AA_CONTRAST, cn, contrastRatio } from "@/shared/lib";

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
      <span className={cn("relative h-5 w-9 shrink-0 transition-colors", on ? "bg-ink" : "bg-ink/20")}>
        <span className={cn("absolute top-0.5 size-4 bg-paper shadow transition-[left]", on ? "left-4.5" : "left-0.5")} />
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

/** Thẻ chọn skin: ô xem thử tự mang data-skin và màu của skin đó nên viền, bo góc, bóng hiện đúng kiểu thật. */
function SkinCard({ skin, selected, onPick }: { skin: SkinDef; selected: boolean; onPick: () => void }) {
  const t = useT();
  const v = skin.vars;
  const cssVars = Object.fromEntries(Object.entries(v).map(([k, val]) => [`--color-${k}`, val])) as CSSProperties;
  return (
    <button
      type="button"
      onClick={onPick}
      disabled={skin.disabled}
      aria-pressed={selected}
      className={cn("skin-card flex flex-col gap-2 border-2 p-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink", selected ? "border-ink" : "border-ink/10 hover:border-ink/30", skin.disabled && "cursor-not-allowed opacity-50 hover:border-ink/10")}
    >
      <span data-skin={skin.id} className="skin-preview flex h-16 items-center gap-2 overflow-hidden p-2" style={cssVars}>
        <span className="skin-preview-card flex h-full flex-1 items-center justify-center gap-0.5 bg-sheet">
          <span lang="th" className="font-thai text-xl leading-none text-ink">ก</span>
          {(["mid", "high", "low"] as const).map((k) => (
            <span lang="th" key={k} className="font-thai text-lg leading-none" style={{ color: v[k] }}>{GLYPH[k]}</span>
          ))}
        </span>
        <span className="skin-preview-btn h-5 w-7 bg-brand" />
      </span>
      <span className="text-xs font-semibold">{t.settings.skins[skin.id].name}{skin.disabled && <span className="ml-1.5 font-normal text-ink-soft">· {t.settings.skinInDev}</span>}</span>
      <span className="text-[0.6875rem] leading-snug text-ink-soft">{t.settings.skins[skin.id].hint}</span>
    </button>
  );
}

/** Ví dụ ค้าน tô đúng màu từng phần, đổi màu là thấy ngay. */
function Sample() {
  const t = useT();
  return (
    <div className="note-paper flex items-center justify-between gap-3 px-4 py-2">
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
  const { activeId, palette, paper, setSkin, setColor, resetPalette, setPaper } = usePreferences(
    useShallow((p) => ({ activeId: p.skinId, palette: p.palette, paper: p.paper, setSkin: p.setSkin, setColor: p.setColor, resetPalette: p.resetPalette, setPaper: p.setPaper })),
  );
  const active = SKIN_BY_ID.get(activeId)!;
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
      {keys.map((k) => {
        const value = overrides[k] ?? active.vars[k];
        // Màu người dùng chọn phải đọc được trên cả giấy lẫn tờ ghi chú, nếu không thì báo ngay
        const low = Math.min(contrastRatio(value, active.vars.paper), contrastRatio(value, active.vars.sheet)) < AA_CONTRAST;
        return (
        <label key={k} className="flex flex-col items-center gap-1 text-xs text-ink-soft">
          <span lang="th" className="font-thai relative grid size-11 place-items-center overflow-hidden bg-sheet text-2xl leading-none ring-2 ring-ink/10 focus-within:ring-ink sm:size-10" style={{ color: `var(--color-${k})` }}>
            {GLYPH[k]}
            <input type="color" value={value} onChange={(e) => setColor(activeId, k, e.target.value)} className="absolute inset-0 size-full cursor-pointer opacity-0" aria-label={low ? `${label(k)}: ${t.settings.lowContrast}` : label(k)} />
          </span>
          {label(k)}
          {low && <span className="font-medium text-high">{t.settings.lowContrast}</span>}
        </label>
        );
      })}
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
        className="fixed inset-x-0 bottom-0 z-[70] max-h-[88dvh] outline-none space-y-6 overflow-y-auto overscroll-contain border-2 border-ink bg-paper p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-[3.75rem] sm:max-h-[calc(100dvh-5rem)] sm:w-[25rem] md:right-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-poster text-3xl font-extrabold uppercase leading-none">{t.settings.title}</h2>
          <button type="button" onClick={close} className="grid size-11 place-items-center border-2 border-ink hover:bg-ink hover:text-paper focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-ink" aria-label={t.settings.close}>
            <svg aria-hidden viewBox="0 0 24 24" className="size-4 stroke-current stroke-2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <section className="space-y-3" aria-label={t.settings.skinTitle}>
          <div>
            <h3 className="font-poster text-xl font-bold uppercase leading-none">{t.settings.skinTitle}</h3>
            <p className="text-xs text-ink-soft">{t.settings.skinHint}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {SKINS.map((sk) => (
              <SkinCard key={sk.id} skin={sk} selected={sk.id === activeId} onPick={() => setSkin(sk.id)} />
            ))}
          </div>
        </section>

        <section className="space-y-3" aria-label={t.settings.paperTitle}>
          <div>
            <h3 className="font-poster text-xl font-bold uppercase leading-none">{t.settings.paperTitle}</h3>
            <p className="text-xs text-ink-soft">{t.settings.paperHint}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {PAPER_STYLES.map((p) => (
              <button key={p} type="button" aria-pressed={paper === p} onClick={() => setPaper(p)} className={cn("flex flex-col items-center gap-1.5 border-2 p-2 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink", paper === p ? "border-ink" : "border-ink/10 hover:border-ink/30")}>
                <span data-style={p} className="note-paper block h-12 w-full [--u:0.75rem]" />
                {t.settings.paper[p]}
              </button>
            ))}
          </div>
        </section>

        <details className="group space-y-3">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
            <span>
              <h3 className="font-poster text-xl font-bold uppercase leading-none">{t.settings.partColors}</h3>
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
            <span>{fmt(t.settings.perSkin, { skin: t.settings.skins[active.id].name })}</span>
            <button type="button" onClick={() => resetPalette(activeId)} className="shrink-0 border border-ink/15 px-3 py-2 font-medium text-ink hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
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
        className="nav-btn"
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
