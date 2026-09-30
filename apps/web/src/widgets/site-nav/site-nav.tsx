"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LEARNING_PATH, stripLocale } from "@/shared/config/routes";
import { useLocale, useLocalePath, useT } from "@/shared/i18n";
import { CLASS_META } from "@/entities/consonant";
import { LocaleSwitch } from "@/features/toggle-locale";
import { ThemeSwitch } from "@/features/toggle-theme";
import { SettingsMenu } from "@/features/customize-appearance";
import { gsap, useGSAP, prefersReducedMotion } from "@/shared/lib/gsap";
import { cn } from "@/shared/lib";

function ClassLegend({ className }: { className?: string }) {
  const { locale } = useLocale();
  const t = useT();
  return (
    <ul
      className={cn("flex items-center gap-3 text-xs text-ink-soft", className)}
      aria-label={t.nav.classColors}
    >
      {(["mid", "high", "low"] as const).map((c) => (
        <li key={c} className="flex items-center gap-1.5">
          <span className={cn("size-2.5 rounded-full", CLASS_META[c].bg)} />{" "}
          {CLASS_META[c].label[locale]}
        </li>
      ))}
    </ul>
  );
}

/** Thanh điều hướng trên cùng; màn hình hẹp gom các bước vào menu hamburger. */
export function SiteNav() {
  const pathname = usePathname();
  const path = stripLocale(pathname ?? "/");
  const href = useLocalePath();
  const t = useT();
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (
        !panel.current?.contains(e.target as Node) &&
        !button.current?.contains(e.target as Node)
      )
        setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  useGSAP(
    () => {
      if (!open || prefersReducedMotion()) return;
      gsap.fromTo(
        panel.current,
        { y: -12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.25, ease: "power2.out" },
      );
      gsap.fromTo(
        ".menu-item",
        { x: -12, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, stagger: 0.05, delay: 0.05 },
      );
    },
    { dependencies: [open], scope: panel },
  );

  return (
    <div className="relative">
      <nav
        aria-label={t.nav.path}
        className="mx-auto flex h-14 max-w-[1440px] items-center gap-1.5 px-3 sm:gap-2 sm:px-4 md:px-6"
      >
        <Link
          href={href("/")}
          className="group mr-2 flex shrink-0 items-baseline gap-2 whitespace-nowrap leading-none md:mr-4"
          aria-label={t.nav.brandLabel}
        >
          <span className="font-thai text-xl font-semibold sm:text-2xl">
            น่ารัก<span className="text-tone-falling transition-colors group-hover:text-mid">ไทย</span>
          </span>
          <span className="hidden text-xs font-medium tracking-wide text-ink-soft min-[420px]:inline">NarakThai</span>
        </Link>
        <ul className="hidden items-center gap-1 lg:flex">
          {LEARNING_PATH.map((item) => {
            const active = path === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={href(item.href)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-ink",
                    active
                      ? "bg-ink text-paper"
                      : "text-ink-soft hover:bg-ink/5 hover:text-ink",
                  )}
                >
                  {t.routes[item.key].title}
                </Link>
              </li>
            );
          })}
        </ul>
        <ClassLegend className="ml-auto mr-4 hidden xl:flex" />
        <div className="ml-auto flex items-center gap-2 xl:ml-0">
          <LocaleSwitch />
          <ThemeSwitch />
          <SettingsMenu />
          <button
            ref={button}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            className="grid size-10 place-items-center rounded-full border border-ink/15 hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:size-9 lg:hidden"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="size-4 stroke-current stroke-2"
              strokeLinecap="round"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div
          ref={panel}
          id="site-menu"
          className="absolute inset-x-0 top-full border-b border-ink/10 bg-paper px-4 pb-6 pt-2 shadow-xl lg:hidden"
        >
          <ol className="space-y-1">
            {LEARNING_PATH.map((item) => {
              const active = path === item.href;
              return (
                <li key={item.href} className="menu-item">
                  <Link
                    href={href(item.href)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex gap-3 rounded-2xl p-3",
                      active ? "bg-ink text-paper" : "hover:bg-ink/5",
                    )}
                  >
                    <span>
                      <span className="block font-medium">
                        {t.routes[item.key].title}
                      </span>
                      <span
                        className={cn(
                          "block text-sm",
                          active ? "opacity-80" : "text-ink-soft",
                        )}
                      >
                        {t.routes[item.key].blurb}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
          <ClassLegend className="menu-item mt-4 px-3" />
        </div>
      )}
    </div>
  );
}
